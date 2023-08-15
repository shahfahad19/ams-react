import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../../Context/AppContext';
import SubSectionHeader from '../../Utils/SubSectionHeader';
import Table from '../../Utils/Table';

const SubjectAttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, isLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const ctx = useContext(AppContext);

  const params = useParams();
  useEffect(() => {
    axios
      .get(`${ctx.baseURL}/attendances?subject=${params.subjectId}`, {
        credentials: 'include',
        headers: {
          Authorization: 'Bearer ' + ctx.token
        }
      })
      .then((response) => {
        setAttendances(response.data.data.attendances);
        setDates(response.data.data.dates);

        if (response.data.data.attendances.length === 0) setErrorMessage('No Attendances found');
        isLoading(false);
      })
      .catch((error) => {
        setErrorMessage(ctx.computeError(error));
        isLoading(false);
      });
  }, []);

  return (
    <div className="flex-grow">
      <SubSectionHeader text="Attendance List" />

      <Table error={errorMessage} loading={loading}>
        <thead>
          <tr>
            <th>R.no</th>
            <th>Name</th>
            {attendances.length > 0 &&
              attendances[0].dates.map((date) => (
                <th key={date}>
                  <p className="text-xs text-center border-none">
                    {new Date(date).toLocaleDateString('en-UK', {
                      day: '2-digit',
                      month: 'short',
                      year: '2-digit'
                    })}
                  </p>
                  <p className="text-center text-xs border-none">
                    {new Date(date).toLocaleTimeString('en-UK', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </th>
              ))}
            <th>
              <p className="no-border text-center">Percentage</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {attendances.length > 0 &&
            attendances.map((attendance) => (
              <tr key={attendance._id}>
                <td>{attendance.rollNo}</td>
                <td className="text-bold">{attendance.name}</td>

                {dates.map((date, index) => (
                  <React.Fragment key={index}>
                    {attendance.dates.indexOf(date) === -1 && (
                      <td>
                        <p className="text-center font-medium text-neutral">X</p>
                      </td>
                    )}
                    {attendance.dates.indexOf(date) > -1 && (
                      <td key={index}>
                        <p
                          className={`${
                            attendance.attendance[attendance.dates.indexOf(date)].status[0] === 'p'
                              ? 'text-success'
                              : attendance.attendance[attendance.dates.indexOf(date)].status[0] ===
                                'a'
                              ? 'text-error'
                              : 'text-warning'
                          } text-center font-medium `}>
                          {attendance.attendance[
                            attendance.dates.indexOf(date)
                          ].status[0].toUpperCase()}
                        </p>
                      </td>
                    )}
                  </React.Fragment>
                ))}

                <td>
                  <p
                    className={`${
                      parseFloat(attendance.percentage) < 75.0 ? 'text-error' : 'text-success'
                    } text-center font-semibold`}>
                    {attendance.percentage === 'N/A'
                      ? attendance.percentage
                      : attendance.percentage === '100%'
                      ? attendance.percentage
                      : parseFloat(attendance.percentage).toFixed(2) + '%'}
                  </p>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SubjectAttendanceList;
