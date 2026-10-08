
const BASE_URL = "https://http.cat";

export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "ApiError";
    this.status = status; 
  }
}


function validateCode(code) {
  const trimmed = String(code).trim();

  if (!trimmed) {
    throw new ApiError("Introdu un cod de status HTTP.", 400);
  }
  if (!/^\d+$/.test(trimmed)) {
    throw new ApiError("Codul trebuie să conțină doar cifre (ex: 404).", 400);
  }
  const num = Number(trimmed);
  if (num < 100 || num > 599) {
    throw new ApiError("Codurile HTTP valide sunt între 100 și 599.", 400);
  }
  return num;
}


function probeImage(url, code) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(url);

    img.onerror = () => {
    
      reject(
        new ApiError(
          `Nu există imagine pentru codul ${code} (necuprins în colecția http.cat).`,
          404
        )
      );
    };

    img.src = url;
  });
}

export async function getCatImageUrl(code) {
  const validCode = validateCode(code);
  const url = `${BASE_URL}/${validCode}.jpg`;
  return probeImage(url, validCode);
}