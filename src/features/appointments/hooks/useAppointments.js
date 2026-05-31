import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllAppointments, getDoctorAppointments, getPatientAppointments, updateAppointment } from "../../../services/appointmentService";
import { getPatientById } from "../../../services/patientService";
import { getDoctorById } from "../../../services/doctorService";
import { getDoctorAvailabilityById } from "../../../services/availabilityService";
import { getRateByAppointmentId } from "../../../services/ratingService";

export const useAllAppointments = (status = "", pageNumber = 1) => {
  return useQuery({
    queryKey: ["appointments", "all", status, pageNumber],
    queryFn: async () => {
      const response = await getAllAppointments(status, pageNumber);
      return response?.data || response;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const usePatientAppointments = (patientId, status = "", pageNumber = 1) => {
  return useQuery({
    queryKey: ["appointments", "patient", patientId, status, pageNumber],
    queryFn: async () => {
      if (!patientId) return [];
      const response = await getPatientAppointments(status, patientId, pageNumber);
      return response?.data || response;
    },
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useDoctorAppointments = (doctorId, status = "", pageNumber = 1, startTime, endTime) => {
  return useQuery({
    queryKey: ["appointments", "doctor", doctorId, status, pageNumber, startTime, endTime],
    queryFn: async () => {
      if (!doctorId) return [];
      const response = await getDoctorAppointments(status, doctorId, pageNumber, startTime, endTime);
      return response?.data || response;
    },
    enabled: !!doctorId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useDetailedDoctorAppointments = (doctorId, status = "", pageNumber = 1) => {
  return useQuery({
    queryKey: ["appointments", "doctor", "detailed", doctorId, status, pageNumber],
    queryFn: async () => {
      if (!doctorId) return { data: [], totalCount: 0 };
      const res = await getDoctorAppointments(status, doctorId, pageNumber);
      const detailedAppointments = await Promise.all(
        (res.data || []).map(async (a) => {
          try {
            const [patientRes, availabilityRes] = await Promise.all([
              getPatientById(a.patientId),
              getDoctorAvailabilityById(a.availabilityId),
            ]);
            return {
              ...a,
              patientName: patientRes?.data?.userName || patientRes?.data?.UserName || "N/A",
              patientCountry: patientRes?.data?.country || patientRes?.data?.Country || "N/A",
              patientBloodType: patientRes?.data?.bloodType || patientRes?.data?.BloodType || "N/A",
              startTime: availabilityRes?.Data?.StartTime ?? availabilityRes?.data?.startTime,
            };
          } catch (err) {
            return { ...a, patientName: "Error" };
          }
        })
      );
      return { data: detailedAppointments, totalCount: res.totalCount || 0 };
    },
    enabled: !!doctorId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useDetailedPatientAppointments = (patientId, status = "", pageNumber = 1) => {
  return useQuery({
    queryKey: ["appointments", "patient", "detailed", patientId, status, pageNumber],
    queryFn: async () => {
      if (!patientId) return { data: [], totalCount: 0 };
      const res = await getPatientAppointments(status, patientId, pageNumber);
      const detailedAppointments = await Promise.all(
        (res.data || []).map(async (a) => {
          const appointmentData = { ...a, doctor: {}, hasRated: false, rateId: null };
          try {
            const doctorRes = await getDoctorById(a.doctorId);
            const dData = doctorRes?.data || doctorRes;
            appointmentData.doctor = {
              ...dData,
              userName: dData?.userName || dData?.UserName || "N/A",
              country: dData?.country || dData?.Country || "N/A",
              specialityName: dData?.specialityName || dData?.SpecialityName || "N/A",
            };
            appointmentData.doctorPrice = dData?.consulationPrice || dData?.ConsulationPrice || 0;
          } catch (err) {}
          try {
            const availabilityRes = await getDoctorAvailabilityById(a.availabilityId);
            const avail = availabilityRes?.Data ?? availabilityRes?.data ?? {};
            appointmentData.startTime = avail.StartTime ?? avail.startTime;
            appointmentData.endTime = avail.EndTime ?? avail.endTime;
          } catch (err) {
            appointmentData.startTime = a.startTime || a.appointmentDate;
            appointmentData.endTime = a.endTime;
          }
          try {
            if (a.appointmentStatus === "Completed") {
              const ratingRes = await getRateByAppointmentId(a.id);
              if (ratingRes?.data) {
                appointmentData.hasRated = true;
                appointmentData.rateId = ratingRes.data.id;
              }
            }
          } catch {}
          return appointmentData;
        })
      );
      return { data: detailedAppointments, totalCount: res.totalCount || 0 };
    },
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useDetailedAllAppointments = (status = "", pageNumber = 1) => {
  return useQuery({
    queryKey: ["appointments", "all", "detailed", status, pageNumber],
    queryFn: async () => {
      const res = await getAllAppointments(status, pageNumber);
      const detailed = await Promise.all(
        (res.data || []).map(async (a) => {
          try {
            const [doctorRes, patientRes, availabilityRes] = await Promise.all([
              getDoctorById(a.doctorId),
              getPatientById(a.patientId),
              getDoctorAvailabilityById(a.availabilityId),
            ]);
            const doctorData = doctorRes?.data || doctorRes;
            const patientData = patientRes?.data || patientRes;
            const availabilityData = availabilityRes?.Data ?? availabilityRes?.data ?? {};

            return {
              ...a,
              id: a.id || a.Id,
              doctorName: doctorData?.userName || doctorData?.UserName || "N/A",
              patientName: patientData?.userName || patientData?.UserName || "N/A",
              patientCountry: patientData?.country || patientData?.Country || "N/A",
              doctorCountry: doctorData?.country || doctorData?.Country || "N/A",
              startTime: availabilityData?.StartTime ?? availabilityData?.startTime,
              endTime: availabilityData?.EndTime ?? availabilityData?.endTime,
            };
          } catch (err) {
            return { ...a, doctorName: "Error", patientName: "Error" };
          }
        })
      );
      return { data: detailed, totalCount: res.totalCount || 0, pageSize: res.pageSize || 5 };
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
    },
  });
};
