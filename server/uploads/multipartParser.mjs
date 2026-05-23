
export const parseMultipartData = async (req) => {
  return new Promise((resolve, reject) => {
    let data = '';
    
    req.on('data', chunk => {
      data += chunk.toString();
      if (data.length > 50 * 1024 * 1024) { // 50MB limit
        req.connection.destroy();
        reject(new Error('Arquivo muito grande'));
      }
    });
    
    req.on('end', () => {
      try {
        const boundary = req.headers['content-type'].split('boundary=')[1];
        const parts = data.split(`--${boundary}`);
        const fields = {};
        const files = {};
        
        parts.forEach(part => {
          if (part.includes('Content-Disposition')) {
            const match = part.match(/name="([^"]*)"/);
            const filename = part.match(/filename="([^"]*)"/);
            
            if (match) {
              const fieldName = match[1];
              
              if (filename) {
                const contentType = part.match(/Content-Type: ([^\r\n]*)/);
                const fileContent = part.split('\r\n\r\n')[1].split('\r\n--')[0];
                
                files[fieldName] = {
                  filename: filename[1],
                  mimeType: contentType ? contentType[1] : 'application/octet-stream',
                  buffer: Buffer.from(fileContent, 'binary')
                };
              } else {
                const value = part.split('\r\n\r\n')[1]?.split('\r\n')[0] || '';
                fields[fieldName] = value;
              }
            }
          }
        });
        
        resolve({ fields, files });
      } catch (error) {
        reject(error);
      }
    });
    
    req.on('error', reject);
  });
};
