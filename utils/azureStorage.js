const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'imagenes'; // tu contenedor

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function subirImagenAzure(file) {
  const extension = path.extname(file.originalname);
  const nombreArchivo = `${uuidv4()}${extension}`;

  const blockBlobClient = containerClient.getBlockBlobClient(nombreArchivo);
  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype }
  });

  return blockBlobClient.url; // URL pública de la imagen
}

module.exports = { subirImagenAzure };
