import axios from "axios";
import Exam from "../models/Exam"; // Asegúrate de importar correctamente el modelo Exam
import ExamID from "../models/ExamID";
import Subject from "../models/Subject";
import Catalog from "../models/Catalog";
import QueueModel from "../models/QueueModel";

const API_URL = "http://161.35.233.204:3000";
const EXAMS_ENDPOINT = "/api/v1/exams";
const EXAMINEES_ENDPOINT = "/api/v1/subjects";
const EXAMS_QUEUE_ENDPOINT = "/api/v1/queue";
const EXAM_ANSWERS_ENDPOINT = "/api/v1/exams/answers";
const EXAMS_TEMPLATE_ENDPOINT = "/api/v1/exams/template";
const EXAM_DETAILS_ENDPOINT = "/api/v1/exams/answerDetails";
const EXAM_QUESTIONS_ENDPOINT = "/api/v1/exams/questions";

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const apiService = {

    // Método para enviar datos al endpoint /input
    submitInputData: async (data) => {
      try {
        // Construimos el payload correctamente:
        const payload = {
          subjectId: data.subjectId,
          templateId: data.examTemplateId,
          templateInput: {
            "PI.0001.01.Topic1": "Tema de prueba 1",
            "PI.0001.01.Topic2": "Tema de prueba 2",
            "R1.0001.01.FirstName": data.name,
            "R1.0001.03.LastName": "Pérez",
            "EyeColor": "Verde"
          }
        };

        // Realizamos el POST con el cuerpo corregido
        const response = await axios.post(
          `${API_URL}/api/v1/input`,
          payload,
          { headers: getAuthHeaders() }
        );

        return response.data;
      } catch (error) {
        console.error("Error al enviar los datos al endpoint /input:", error);
        throw error;
      }
    },
  // Obtener los examinados
  getSubjectList: async () => {
    try {
      const response = await axios.get(`${API_URL}${EXAMINEES_ENDPOINT}`, {
        headers: getAuthHeaders(),
      });

      // Mapear la respuesta a instancias de Subject
      const subjects = response.data.map(
        (subjectData) => new Subject(subjectData)
      );
      return subjects;
    } catch (error) {
      console.error("Error al obtener los examinados:", error);
      throw error;
    }
  },

  // Obtener los exámenes
  getExamList: async () => {
    try {
      const response = await axios.get(`${API_URL}${EXAMS_ENDPOINT}`, {
        headers: getAuthHeaders(),
      });

      // Mapear la respuesta a instancias de Exam
      const exams = response.data.map((examData) => new Exam(examData));
      return exams; // Retorna los exámenes mapeados al modelo
    } catch (error) {
      console.error("Error al obtener los exámenes:", error);
      throw error;
    }
  },

  // Obtener Detalle del Examen
  getExamDetail: async (id) => {
    try {
      const response = await axios.get(`${API_URL}${EXAMS_ENDPOINT}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (response.data) {
        const exam = new ExamID(response.data);
        return exam; // Retorna el examen mapeado al modelo
      } else {
        console.error("No se encontraron exámenes en la respuesta de la API");
        throw new Error("No se encontraron exámenes en la respuesta de la API");
      }
    } catch (error) {
      console.error("Error al obtener los exámenes:", error);
      throw error;
    }
  },

  // Obtener Detalle del Examen
  getSubjetDetail: async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}${EXAMINEES_ENDPOINT}/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      // Verificar si la respuesta contiene la propiedad 'exams'
      if (response.data) {
        console.log(response.data);
        const exam = new Subject(response.data);
        return exam; // Retorna los exámenes mapeados al modelo
      } else {
        console.error("No se encontraron exámenes en la respuesta de la API");
        throw new Error("No se encontraron exámenes en la respuesta de la API");
      }
    } catch (error) {
      console.error("Error al obtener los exámenes:", error);
      throw error;
    }
  },

  // Obtener preguntas del examen
  getExamQuestions: async (templateId, examId) => {
    try {
      const response = await axios.get(
        `${API_URL}${EXAM_QUESTIONS_ENDPOINT}/${templateId}/${examId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data) {
        return response.data; // Retorna las preguntas del examen
      } else {
        console.error("No se encontraron preguntas del examen");
        throw new Error("No se encontraron preguntas del examen");
      }
    } catch (error) {
      console.error("Error al obtener las preguntas del examen:", error);
      throw error;
    }
  },

  // Obtener las respuestas generales del examen
  getExamAnswer: async (examId) => {
    try {
      const response = await axios.get(
        `${API_URL}${EXAM_ANSWERS_ENDPOINT}/${examId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data) {
        return response.data; // Retorna las respuestas del examen
      } else {
        console.error("No se encontraron respuestas del examen");
        throw new Error("No se encontraron respuestas del examen");
      }
    } catch (error) {
      console.error("Error al obtener las respuestas del examen:", error);
      throw error;
    }
  },

  // Obtener detalles de las respuestas del examen
  getExamAnswerById: async (examId) => {
    try {
      const response = await axios.get(
        `${API_URL}${EXAM_DETAILS_ENDPOINT}/${examId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data) {
        return response.data; // Retorna los detalles de respuestas del examen
      } else {
        console.error("No se encontraron detalles de respuestas del examen");
        throw new Error("No se encontraron detalles de respuestas del examen");
      }
    } catch (error) {
      console.error(
        "Error al obtener detalles de las respuestas del examen:",
        error
      );
      throw error;
    }
  },

  // Obtener la cola de exámenes preparados
  getQueue: async () => {
    try {
      const response = await axios.get(`${API_URL}${EXAMS_QUEUE_ENDPOINT}`, {
        headers: getAuthHeaders(),
      });
      // Mapear la respuesta a instancias de Exam
      console.log(response.data);
      const exams = response.data.map((QueueData) => new QueueModel(QueueData));
      return exams; // Retorna los exámenes mapeados al modelo

    } catch (error) {
      console.error("Error al obtener la cola de exámenes:", error);
      throw error;
    }
  },

  // Eliminar un examen de la cola
  deleteExamFromQueue: async (examId) => {
    try {
      const response = await axios.delete(
        `${API_URL}${EXAMS_QUEUE_ENDPOINT}/${examId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data; // Retorna la respuesta de eliminación
    } catch (error) {
      console.error("Error al eliminar el examen de la cola:", error);
      throw error;
    }
  },

  // Eliminar un examen de la cola
  getQueueById: async (examId) => {
    try {
      const response = await axios.get(
        `${API_URL}${EXAMS_QUEUE_ENDPOINT}/${examId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data; // Retorna la respuesta de eliminación
    } catch (error) {
      console.error("Error al eliminar el examen de la cola:", error);
      throw error;
    }
  },


  // Crear examen desde plantilla
  createExamFromTemplate: async (subjectId, templateId, templateInput) => {
    try {
      const response = await axios.post(
        `${API_URL}${EXAMS_TEMPLATE_ENDPOINT}`,
        { subjectId, templateId, templateInput },
        { headers: getAuthHeaders() }
      );

      return response.data; // Retorna el examen creado
    } catch (error) {
      console.error("Error al crear el examen desde plantilla:", error);
      throw error;
    }
  },

  // Crear nuevo Subject
  createSubject: async (
    subjectName,
    subjectToken,
    subjectEmail,
    subjectMobile
  ) => {
    console.log('Creando');

    try {


      // Verificación de que los campos obligatorios estén presentes
      if (!subjectName) {
        throw new Error("El campo subjectName es requerido.");
      }

      // Validación de tipo y formato para cada parámetro (si es necesario)
      if (subjectToken && typeof subjectToken !== "string") {
        throw new Error("El campo subjectToken debe ser una cadena de texto.");
      }
      if (subjectEmail && !/\S+@\S+\.\S+/.test(subjectEmail)) {
        throw new Error(
          "El campo subjectEmail debe ser un correo electrónico válido."
        );
      }
      if (subjectMobile && !/^\d+$/.test(subjectMobile)) {
        throw new Error("El campo subjectMobile debe contener solo números.");
      }

      // Crear el payload con los parámetros validados
      const payload = {
        subjectName,
        ...(subjectToken && { subjectToken }), // Si existe, agregar subjectToken
        ...(subjectEmail && { subjectEmail }), // Si existe, agregar subjectEmail
        ...(subjectMobile && { subjectMobile }), // Si existe, agregar subjectMobile
      };

      // Realizar la solicitud POST a la API con el payload
      const response = await axios.post(
        `${API_URL}${EXAMINEES_ENDPOINT}`,
        payload,
        { headers: getAuthHeaders() }
      );

      return response.data; // Retorna el Subject creado
    } catch (error) {
      console.error("Error al crear el Subject:", error.message);
      throw error;
    }



  },

  // Obtener lista de catalogos
  getCatalogList: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/Catalog`, {
        headers: getAuthHeaders(),
      });
      const catalogsData = response.data.map(
        (catalogsData) => new Catalog(catalogsData)
      );
      return catalogsData; // Retorna el Subject creado
    } catch (error) {
      console.error("Error al obtener la lista de catalogos:", error.message);
      throw error;
    }
  },
  // Obtener un Catalog por CatalogId
  getCatalogId: async (CatalogId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/Catalog/${CatalogId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const CatalogDetail = new Catalog(response.data);
      return CatalogDetail; // Retorna los exámenes mapeados al modelo

    } catch (error) {
      console.error("Error al obtener el catalogo:", error.message);
      throw error;
    }
  },
};

export default apiService;
