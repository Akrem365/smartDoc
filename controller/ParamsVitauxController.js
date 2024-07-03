import { BadRequestError, NotFoundError } from "../errors/index.js";
import ParamsVitaux from "../models/ParamsVitaux.js";
import { StatusCodes } from "http-status-codes";
import Patients from "../models/Patients.js";
import User from "../models/User.js";
import fs, { readFileSync } from "fs";
import path from "path";
import Historique from "../models/Historique.js";
import io from "../server.js";
import transporter from "../utils/nodemailer.js";
import Notification from "../models/Notifications.js";
import twilio from "twilio";
import { twilioConfig } from "../utils/twliwo.js";
const { accountSid, authToken, twilioPhoneNumber } = twilioConfig;
const client = twilio(accountSid, authToken);
function sendSMS(to, message) {
  client.messages
    .create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    })
    .then((message) => console.log(`SMS sent with ID: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error.message}`));
}
const DeleteParmasVitauxByPatientId = async (req, res) => {
  const { patientId } = req.params;

  const paramsVitaux = await ParamsVitaux.findOne({
    patient: patientId,
  });
  if (!paramsVitaux) {
    throw new NotFoundError(
      `No params Vitaux found for patient with id ${patientId}`
    );
  }
  await ParamsVitaux.deleteOne({ patient: patientId });
  res.status(StatusCodes.OK).json({ paramsVitaux });
};

const getParamsVitauxAllPatinets = async (req, res) => {
  const paramsViatux = await ParamsVitaux.find().populate("patient");
  if (paramsViatux.length === 0) {
    res.status(StatusCodes.OK).json({ message: "No params Viatux found" });
    return;
  }
  res.status(StatusCodes.OK).json(paramsViatux);
};
const getParamsVitauxByPatinetID = async (req, res) => {
  const { patientId } = req.params;

  try {
    const paramsVitaux = await ParamsVitaux.findOne({
      patient: patientId,
    }).populate("patient");

    if (!paramsVitaux) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: `No params Vitaux found for patient with id ${patientId}`,
      });
    }

    res.status(StatusCodes.OK).json(paramsVitaux);
  } catch (error) {
    console.error("Error fetching params vitaux:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
const getParamsViatuxByPatientIdFileJson = async (req, res) => {
  const { patientId } = req.params;
  const desktopPath2 = "C:\\Users\\Akrem\\Desktop\\parametresVitaux";
  const filePath2 = path.join(desktopPath2, `${patientId}.json`);
  let newData2 = [];
  try {
    newData2 = JSON.parse(fs.readFileSync(filePath2, "utf8"));
  } catch (error) {
    console.error("Error reading Params Vitaux file:", error);
  }

  res.status(StatusCodes.OK).json(newData2);
};
const detectionAnomalies = async (data, patient) => {
  const user = await User.findById(patient.createdBy);

  let anomalyDetected = false;
  let anomalyReasons = [];
  console.log("temperature:", data.temperature);
  if (data.temperature < 36.5 || data.temperature > 37.5) {
    anomalyDetected = true;
    anomalyReasons.push("Temperature out of range");
    console.log("Temperature out of range");
  }
  console.log("heartRate:", data.frequenceCardiaque);
  if (data.frequenceCardiaque < 60 || data.frequenceCardiaque > 100) {
    anomalyDetected = true;
    anomalyReasons.push("Heart rate out of range");
    console.log("Heart rate out of range");
  }
  console.log("glycemie:", data.glycemie);
  if (data.glycemie < 70 || data.glycemie > 110) {
    anomalyDetected = true;
    anomalyReasons.push("Glycemie out of range");
    console.log("Glycemie out of range");
  }
  console.log("systolicBP:", data.tensionArterielle.systolique);
  console.log("diastolicBP:", data.tensionArterielle.diastolique);
  if (
    data.tensionArterielle.systolique < 100 ||
    data.tensionArterielle.systolique > 140 ||
    data.tensionArterielle.diastolique > 90 ||
    data.tensionArterielle.diastolique < 60
  ) {
    anomalyDetected = true;
    anomalyReasons.push("Blood pressure out of range");
    console.log("Blood pressure out of range");
  }
  console.log("respiratoryRate:", data.frequenceRespiratoire);
  if (data.frequenceRespiratoire > 20 || data.frequenceRespiratoire < 12) {
    anomalyDetected = true;
    anomalyReasons.push("Respiratory rate out of range");
    console.log("Respiratory rate out of range");
  }
  console.log("oxygenSaturation:", data.saturationOxygene);
  if (data.saturationOxygene < 95 || data.saturationOxygene > 100) {
    anomalyDetected = true;
    anomalyReasons.push("Oxygen saturation out of range");
    console.log("Oxygen saturation out of range");
  }

  if (anomalyDetected) {
    const anomalyMessage = anomalyReasons.join(", ");
    console.log(anomalyReasons);
    console.log("------------");
    console.log(anomalyMessage);
    sendSMS(
      `+216${patient.phoneNumber}`,
      `Cher ${patient.name} ${patient.lastName},
une anomalie a ete detecte. veuillez consulter votre medecin traitant ou les urgences les plus proches de chez vous.`
    );
    const mailOptions = {
      from: "dakrem11@gmail.com",
      to: user.email,
      subject: "Anomalie détectée chez un patient",
      text: `Cher ${user.name},\n\nUne anomalie a été détectée chez ${patient.name} ${patient.lastName}.\n\n Reasons: ${anomalyMessage}\n\nCordialement,\nTon application`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Erreur lors de l'envoi de l'e-mail :", error);
      } else {
        console.log("E-mail envoyé avec succès :", info.response);
      }
    });
    console.log(
      `Une anomalie a été détectée chez le patient ${patient.name} ${patient.lastName}`
    );
    patient.healthStatus = "Bad";
  } else {
    console.log(
      `Aucune anomalie détectée chez le patient ${patient.name} ${patient.lastName}`
    );
    patient.healthStatus = "Good";
    anomalyReasons.push("No issues detected");
  }

  await patient.save();
  console.log(user.name);
  io.emit("notification", {
    message: "Data processed for Patient!",
    patientName: patient.name,
    patientLastName: patient.lastName,
    healthStatus: patient.healthStatus,
    reasons: anomalyReasons,
  });
  const notification = new Notification({
    userId: patient.createdBy,
    type: patient.healthStatus,
    patientName: patient.name,
    patientLastName: patient.lastName,
    anomalyReason: anomalyReasons,
  });
  await notification.save();
};

const GetDataFromCarte = async (req, res) => {
  const {
    patientId,
    temperature,
    respiratoryRate,
    systolicBP,
    diastolicBP,
    oxygenSaturation,
    bloodGlucose,
    heartRate,
    selectedList,
  } = req.body;

  console.log(`Received data for patient ID ${patientId}:`, req.body);

  const desktopPath = "C:\\Users\\Akrem\\Desktop\\Update";
  const filePath = path.join(desktopPath, `${patientId}.json`);
  const patient = await Patients.findById(patientId);

  const dataToWrite = {
    temperature,
    tensionArterielle: {
      systolique: systolicBP,
      diastolique: diastolicBP,
    },
    saturationOxygene: oxygenSaturation,
    glycemie: bloodGlucose,
    frequenceRespiratoire: respiratoryRate,
    frequenceCardiaque: heartRate,
    ecg: selectedList,
    createdAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(dataToWrite, null, 2));
    console.log("Data written to file successfully!");
    detectionAnomalies(dataToWrite, patient);
    const historiqueMesures = new Historique({
      patient: patientId,
      temperature: temperature,
      tensionArterielle: {
        systolique: systolicBP,
        diastolique: diastolicBP,
      },
      saturationOxygene: oxygenSaturation,
      glycemie: bloodGlucose,
      frequenceRespiratoire: respiratoryRate,
      frequenceCardiaque: heartRate,
      ecg: selectedList,
    });
    await historiqueMesures.save();
    // io.emit("notification", { message: "Data processed successfully!" });
    console.log("Data processed event emitted successfully!");
    res.status(200).send("Data received and written to file successfully!");
  } catch (error) {
    console.error("Error emitting notification:", error);
    console.error("Error writing to file:", error);
    res.status(500).send("Error writing to file!");
  }
};
const updateParamsViatux = async (req, res) => {
  const { patientId } = req.params;
  const paramsVitaux = await ParamsVitaux.findOne({ patient: patientId });
  const patient = await Patients.findById(patientId);
  // const { name, lastName } = patient;

  const desktopPath = "C:\\Users\\Akrem\\Desktop\\Update";
  const filePath = path.join(desktopPath, `${patient._id}.json`);
  let newData = {};
  newData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  paramsVitaux.temperature = newData.temperature;
  paramsVitaux.tensionArterielle.systolique =
    newData.tensionArterielle.systolique;
  paramsVitaux.tensionArterielle.diastolique =
    newData.tensionArterielle.diastolique;
  paramsVitaux.saturationOxygene = newData.saturationOxygene;
  paramsVitaux.glycemie = newData.glycemie;
  paramsVitaux.frequenceRespiratoire = newData.frequenceRespiratoire;
  paramsVitaux.frequenceCardiaque = newData.frequenceCardiaque;
  paramsVitaux.ecg = newData.ecg;

  await paramsVitaux.save();
  // detectionAnomalies(newData, patient);
  // try {
  //   const historiqueMesures = new Historique({
  //     patient: patientId,
  //     patient: patientId,
  //     temperature: newData.temperature,
  //     tensionArterielle: {
  //       systolique: newData.tensionArterielle.systolique,
  //       diastolique: newData.tensionArterielle.diastolique,
  //     },
  //     saturationOxygene: newData.saturationOxygene,
  //     glycemie: newData.glycemie,
  //     frequenceRespiratoire: newData.frequenceRespiratoire,
  //     frequenceCardiaque: newData.frequenceCardiaque,
  //     ecg: newData.ecg,
  //   });
  //   await historiqueMesures.save();
  // } catch (error) {
  //   console.log("Error saving measures to historique:", error);
  // }
  // const desktopPath2 = "C:\\Users\\Akrem\\Desktop\\parametresVitaux";
  // const filePath2 = path.join(desktopPath2, `${patientId}.json`);
  // let newData2 = [];
  // try {
  //   newData2 = JSON.parse(fs.readFileSync(filePath2, "utf8"));
  // } catch (error) {
  //   console.error("Error reading Params Vitaux file:", error);
  // }
  // if (!Array.isArray(newData2)) {
  //   newData2 = [];
  // }
  // let newDataEntry = {
  //   patient: patientId,
  //   temperature: newData.temperature,
  //   tensionArterielle: {
  //     systolique: newData.systolicBP,
  //     diastolique: newData.diastolicBP,
  //   },
  //   saturationOxygene: newData.oxygenSaturation,
  //   glycemie: newData.bloodGlucose,
  //   frequenceRespiratoire: newData.respiratoryRate,
  //   frequenceCardiaque: newData.heartRate,
  //   ecg: newData.ecgData,
  //   createdAt: new Date().toISOString(),
  // };
  // newData2.push(newDataEntry);
  // fs.writeFileSync(filePath2, JSON.stringify(newData2, null, 2), (err) => {
  //   if (err) {
  //     console.error("Error writing Params Vitaux file:", err);
  //   } else {
  //     console.log("Params Vitaux file updated successfully", filePath);
  //   }
  // });
  // res.status(StatusCodes.OK).json({ paramsVitaux });
  res.status(StatusCodes.OK).json(newData);
};

export {
  getParamsVitauxAllPatinets,
  DeleteParmasVitauxByPatientId,
  updateParamsViatux,
  getParamsVitauxByPatinetID,
  getParamsViatuxByPatientIdFileJson,
  GetDataFromCarte,
};
// getParmasVitauxByPatientId
