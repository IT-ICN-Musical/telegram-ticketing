"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, User, Calendar, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export interface Ticket {
    id: string;
    timing: string;
    category: string;
    checked_in: boolean;
    username: string;
    checkInDate: string | null;
}

interface TicketVerifierProps {
    userTicket: Ticket;
}

export default function TicketVerifier({ userTicket }: TicketVerifierProps) {
    const router = useRouter();
    const [ticket, setTicket] = useState(userTicket);

    const handleCheckIn = () => {
        setTicket((prev: Ticket) => ({
            ...prev,
            checked_in: true,
            checkInDate: new Date().toLocaleString(),
        }));
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

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Ticket Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Show</p>
                            <p className="text-lg font-semibold">
                                {ticket.timing}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="text-lg font-semibold">
                                {ticket.category}
                            </p>
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
                                        <span className="text-lg font-semibold">
                                            Checked In
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2 text-red-600">
                                        <XCircle size={24} />
                                        <span className="text-lg font-semibold">
                                            Not Checked In
                                        </span>
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
                                        <span>{ticket.checkInDate}</span>
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
            </div>
        </div>
    );
}
