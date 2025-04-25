import apiService from './apiService';  // Asegúrate de importar tu servicio de API

const subjectService = {
  parseCSVFile: async (file) => {
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(Boolean);

      if (lines.length > 101) {
        throw new Error("El archivo no debe contener más de 100 sujetos.");
      }

      const headers = lines[0].split(",").map(h => h.trim());
      const requiredHeaders = ["subjectName", "subjectToken", "subjectEmail", "subjectMobile"];

      const hasAllHeaders = requiredHeaders.every((header) => headers.includes(header));
      if (!hasAllHeaders) {
        throw new Error("El archivo CSV no contiene los encabezados requeridos.");
      }

      const subjectArray = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",");
        const subject = {};
        headers.forEach((header, index) => {
          subject[header] = row[index]?.trim() || "";
        });

        const isValid = requiredHeaders.every((key) => key in subject);
        if (!isValid) {
          throw new Error(`Fila ${i + 1} no tiene la estructura correcta.`);
        }

        // Añadimos el sujeto al array
        subjectArray.push(subject);
      }

      // Ahora enviamos los sujetos a la API
      const promises = subjectArray.map(subject => {
        return apiService.createSubject(
          subject.subjectName,
          subject.subjectToken,
          subject.subjectEmail,
          subject.subjectMobile
        );
      });

      // Esperamos que todos los sujetos se hayan enviado a la API
      await Promise.all(promises);

      return subjectArray;  // Devolvemos el array de sujetos procesados
    } catch (error) {
      console.error("Error al procesar el archivo CSV:", error.message);
      throw error;  // Propagamos el error para manejarlo en otro lugar
    }
  },
};

export default subjectService;
