"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  User,
  Calendar,
  ArrowLeft,
  Ticket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { request } from "@/utils/request";
import { useMutation, useQuery, useQueryClient } from "react-query";

export interface AttendanceTime {
  Time: string; // ISO string representation of the time (or default value)
  Valid: boolean;
}

export interface ViewersWithSeating {
  viewer_id: string; // corresponds to uuid.UUID
  order_id: string; // corresponds to uuid.UUID
  ticket_id: string; // corresponds to uuid.UUID
  name: string; // corresponds to string

  checked_in_by: string | null; // may be null
  attendance_time: AttendanceTime; // nested object with Time and Valid fields
  created_at: string; // ISO timestamp string
  show_name: string;
  category: string;
}
export interface Ticket {
  id: string;
  timing: string;
  category: string;
  checked_in: boolean;
  username: string;
  checkInDate: string | null;
  name: string;
}

interface TicketVerifierProps {
  userTicketId: string;
}

async function Checkin(ticketId: string) {
  const res = await request<void>({
    path: `v2/viewers/protected/${ticketId}/checkin`,
    method: "POST",
    withAuth: true,
  });

  if (!res.success) {
    throw new Error(res.message);
  }

  return res;
}

const fetchTicket = async (ticketId: string): Promise<Ticket> => {
  console.log(ticketId);
  const res = await request<ViewersWithSeating>({
    path: `v2/viewers/protected/${ticketId}/complete`,
    withAuth: true,
  });
  if (!res.success) {
    throw new Error("Failed to fetch");
  }

  // map to ticket

  const ticket: Ticket = {
    id: res.data.ticket_id,
    timing: res.data.show_name,
    category: res.data.category,
    checked_in: res.data.attendance_time.Valid,
    username: res.data.checked_in_by ?? "",
    checkInDate: res.data.attendance_time.Valid
      ? res.data.attendance_time.Time
      : null,
    name: res.data.name,
  };

  return ticket;
};

function TicketContent({
  ticket,
  handleCheckIn,
}: {
  ticket: Ticket;
  handleCheckIn: () => void;
}) {
  const date = new Date(ticket.checkInDate ?? "");

  return (
    <>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Ticket Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Show</p>
              <p className="text-lg font-semibold">{ticket.timing}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-lg font-semibold">{ticket.category}</p>
            </div>
          </div>
          <div className="mt-4 text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Viewer Name</p>
            <p className="text-lg font-semibold">{ticket.name}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Check-in Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center">
              {ticket.checked_in ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle size={24} />
                  <span className="text-lg font-semibold">Checked In</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle size={24} />
                  <span className="text-lg font-semibold">Not Checked In</span>
                </div>
              )}
            </div>

            {ticket.checked_in && ticket.checkInDate && (
              <div className="w-full space-y-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <User size={20} />
                  <span>{ticket.username}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={20} />
                  <span>{date.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!ticket.checked_in && (
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg"
          onClick={handleCheckIn}
        >
          Check In Ticket
        </Button>
      )}
    </>
  );
}

export default function TicketVerifier({ userTicketId }: TicketVerifierProps) {
  const router = useRouter();
  const { invalidateQueries } = useQueryClient();
  const { data: ticket, refetch } = useQuery({
    queryFn: () => fetchTicket(userTicketId),
    staleTime: 1000 * 60 * 5,
    queryKey: ["ticket", userTicketId],
  });
  const {
    mutate,
    isSuccess,
    error: mutateError,
  } = useMutation(Checkin, {
    onSuccess: () => {
      // hack ga bisa pakai invalidate queries
      refetch();
    },
  });

  useEffect(() => {
    if (mutateError) {
      alert(mutateError);
    }
  }, [mutateError]);

  const handleCheckIn = () => {
    mutate(userTicketId);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            className="p-2 hover:bg-gray-200"
            onClick={handleBack}
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Ticket Verification
          </h1>
          <div className="w-10" />
        </div>
        {ticket ? (
          <TicketContent ticket={ticket} handleCheckIn={handleCheckIn} />
        ) : (
          <p>An unknown error has occured.</p>
        )}
      </div>
    </div>
  );
}
