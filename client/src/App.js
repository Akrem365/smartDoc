import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Error, Register, Landing, ProtectedRoute } from "./pages";
import {
  AddPatient,
  AllPatient,
  Profile,
  Stats,
  StatistiqueAll,
  Appointment,
  AddAppointment,
  AdminDashboared,
  ApprovalMessage,
  HistoriqueParamsVitaux,
  Calendrier,
  EditAppointment,
  Notification,
} from "./pages/Dashboared";
import SharedLayout from "./pages/Dashboared/sharedLayout.js";
import { useAppcontext } from "./context/appContext.js";
import io from "socket.io-client";
import { useEffect, useState } from "react";
// const socket = io("http://192.168.1.2:5000");
const socket = io("http://192.168.72.240:5000");
socket.on("connect", () => {
  console.log("Connected to server");
});
function App() {
  const [refreshPatients, setRefreshPatients] = useState(false);
  const [refreshNotification, setRefreshNotification] = useState(false);
  useEffect(() => {
    console.log("useEffect is called");

    socket.addEventListener("notification", (data) => {
      console.log("Notification received:", data);
      alert(
        `Message: ${data.message}\nPatient Name: ${data.patientName}\nPatient Last Name: ${data.patientLastName}\nHealth Status: ${data.healthStatus}\n Reasons : ${data.reasons}`
      );
      console.log("notification succes");
      setRefreshPatients(true);
      setRefreshNotification(true);
    });

    return () => {
      socket.off("notification");
    };
  }, []);
  const { role } = useAppcontext();
  let dashboardRoute;

  if (role === "admin") {
    dashboardRoute = (
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboared />} />
        {/* <Route path="historique" element={<Historique />} /> */}
      </Route>
    );
  } else {
    dashboardRoute = (
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SharedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Stats />} />
        <Route path="statistique" element={<StatistiqueAll />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="all-patient"
          element={
            <AllPatient
              refreshPatients={refreshPatients}
              setRefreshPatients={setRefreshPatients}
            />
          }
        />
        <Route path="add-patient" element={<AddPatient />} />
        <Route path="Calendrier" element={<Calendrier />} />
        <Route path="AddAppointment" element={<AddAppointment />} />
        <Route path="Appointment" element={<Appointment />} />
        <Route path="EditAppointment" element={<EditAppointment />} />
        <Route path="HistoriqueVitaux" element={<HistoriqueParamsVitaux />} />
        <Route
          path="Notifications"
          element={
            <Notification
              refreshNotification={refreshNotification}
              setRefreshNotification={setRefreshNotification}
            />
          }
        />
      </Route>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {dashboardRoute}
        <Route path="/Register" element={<Register />} />
        <Route path="/Landing" element={<Landing />} />
        <Route path="/approvalMessage" element={<ApprovalMessage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
