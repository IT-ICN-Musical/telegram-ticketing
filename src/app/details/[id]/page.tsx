"use client";
import TicketVerifier from "@/components/TicketVerifier";
import { Ticket } from "@/components/TicketVerifier";
import { protectedFetch } from "@/utils/fetch";
import { request } from "@/utils/request";
import { useParams } from "next/navigation";
import { useQuery } from "react-query";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Represents the sql.NullTime structure

export default function TicketVerifierPage() {
  //   const ticket: Ticket = await fetchTicket((await params).id);

  const params = useParams<{ id: string }>();

  return <TicketVerifier userTicketId={params.id} />;
}
