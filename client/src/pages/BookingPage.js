import { DatePicker, message, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import "./../styles/LayoutStyles.css";
import moment from "moment";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [date, setDate] = useState("");
  const [result] = useState([]);

  const dispatch = useDispatch();
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handleAvailability function
  const handleAvailability = async (time) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/user/booking-availbility",
        {
          doctorId: params.doctorId,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        Modal.success({
          title: `Appointment Available!`,
          content: `Do you want to book the appointment for ${time} on ${date}?`,
          onOk() {
            handleBooking(time);
          },
          closable: true,
        });
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  // =============== booking func
  const handleBooking = async (time) => {
    try {
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(
          "Appointment has been submitted successfully! You will be notified of the approval within 24 hours.",
          10
        );
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (date !== "") {
      const dayOfWeek = moment(date, "DD-MM-YYYY").format("ddd");
      if (doctors.days.includes(dayOfWeek)) {
        setSlotsVisible(true);
      }
    }
  }, [date, doctors.days]);

  function intervals(startString, endString) {
    var start = moment(startString, "HH:mm");
    var end = moment(endString, "HH:mm");
    const slotDuration = 60; // 60 minutes

    while (start.isBefore(end)) {
      if (result.includes(start.format("HH:mm"))) {
        return null;
      } else {
        result.push(start.format("HH:mm"));
        start.add(slotDuration, "minutes");
      }
    }
    return result;
  }

  intervals(doctors.starttime, doctors.endtime);

  return (
    <Layout>
      <div className="container">
        <h3 className="text-center my-4">Book an Appointment</h3>
        {doctors && (
          <div className="card mx-auto mb-4" style={{ maxWidth: "350px" }}>
            <div className="card-body">
              <h5 className="card-title text-center">
                Dr. {doctors.firstName} {doctors.lastName}
              </h5>
              <h6 className="card-subtitle mb-2 text-muted text-center">
                Fees: {doctors.feesPerConsultation}
              </h6>
              <br></br>
              <h6 className="card-subtitle mb-2 text-muted text-center">
                Days Available: {doctors.days?.map((day) => day).join(", ")}
              </h6>
              <h6 className="card-subtitle mb-2 text-muted text-center">
                Timings: {doctors.starttime} - {doctors.endtime}
              </h6>
              <div className="appoint-card-body">
                <div className="d-flex flex-column w-50 mx-auto">
                  <DatePicker
                    className="m-2 date-picker"
                    format="DD-MM-YYYY"
                    onChange={(value) => {
                      const selectedDate = value
                        ? value.format("DD-MM-YYYY")
                        : "";
                      setDate(selectedDate);
                    }}
                  />
                  <div>
                    {date && slotsVisible && result && result.length > 0
                      ? result.map((time, index) => {
                          return (
                            <button
                              className="btn btn-primary mt-2 w-100"
                              onClick={() => handleAvailability(time)}
                            >
                              {time}
                            </button>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
