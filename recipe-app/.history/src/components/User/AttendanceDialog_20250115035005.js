import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

const AttendanceDialog = ({ open, onOpenChange }) => {
  const [value, setValue] = useState(new Date());
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAttendanceHistory();
    }
  }, [open]);

  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch('/api/attendance/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAttendanceHistory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch attendance history:', error);
    }
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchAttendanceHistory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to check in');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if a date has attendance
  const hasAttendance = (date) => {
    return attendanceHistory.some(attendance => 
      format(new Date(attendance.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Custom tile content
  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasAttendance(date)) {
      return <div className="bg-green-500 w-2 h-2 rounded-full mx-auto mt-1"></div>;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Daily Attendance</AlertDialogTitle>
          <AlertDialogDescription>
            Check in daily to receive 50 xu!
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <Calendar
            onChange={setValue}
            value={value}
            tileContent={tileContent}
            className="border rounded-lg p-4"
          />
          
          <Button 
            onClick={handleCheckIn}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Checking in...' : 'Check In Now (+50 xu)'}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AttendanceDialog;