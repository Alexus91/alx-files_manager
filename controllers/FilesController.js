import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { ObjectID } from 'mongodb';
import mime from 'mime-types';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async getUser(request) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (userId) {
      const users = dbClient.db.collection('users');
      const idObject = new ObjectID(userId);
      const user = await users.findOne({ _id: idObject });
      return user;
    }
    return null;
  }

  static async postUpload(request, response) {
    const user = await FilesController.getUser(request);
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { name, type, parentId, isPublic, data } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Missing name' });
    }

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return response.status(400).json({ error: 'Missing or invalid type' });
    }

    if (type !== 'folder' && !data) {
      return response.status(400).json({ error: 'Missing data' });
    }

    const files = dbClient.db.collection('files');
    let fileDocument;

    if (type === 'folder') {
      fileDocument = {
        userId: user._id,
        name,
        type,
        parentId: parentId || 0,
        isPublic: !!isPublic,
      };
    } else {
      const filePath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const fileName = `${filePath}/${uuidv4()}`;

      const buff = Buffer.from(data, 'base64');

      try {
        await fs.mkdir(filePath, { recursive: true });
        await fs.writeFile(fileName, buff, 'utf-8');
      } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal server error' });
      }

      fileDocument = {
        userId: user._id,
        name,
        type,
        parentId: parentId || 0,
        isPublic: !!isPublic,
        localPath: fileName,
      };
    }

    try {
      const result = await files.insertOne(fileDocument);
      const insertedFile = result.ops[0];
      const responseFile = {
        id: insertedFile._id,
        userId: insertedFile.userId,
        name: insertedFile.name,
        type: insertedFile.type,
        isPublic: insertedFile.isPublic,
        parentId: insertedFile.parentId,
      };
      return response.status(201).json(responseFile);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default FilesController;
