"use client";
import TicketVerifier from "@/components/TicketVerifier";
import { useParams } from "next/navigation";

// Represents the sql.NullTime structure

export default function TicketVerifierPage() {
  //   const ticket: Ticket = await fetchTicket((await params).id);

  const params = useParams<{ id: string }>();

  return <TicketVerifier userTicketId={params.id} />;
}
