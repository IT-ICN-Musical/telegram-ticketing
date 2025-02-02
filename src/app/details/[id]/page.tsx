import TicketVerifier from "@/components/TicketVerifier";
import { Ticket } from "@/components/TicketVerifier";

interface PageProps {
    params: {
        id: string;
    };
}
const fetchTicket = async (ticketId: string): Promise<Ticket> => {
    const baseUrl = process.env.BASE_URL;
    // const res = await fetch(`${baseUrl}/v2/viewers/protected/${ticketId}`);
    // if (!res.ok) {
    //     throw new Error("Failed to fetch ticket");
    // }
    const ticket: Ticket = {
        id: ticketId,
        timing: "Night",
        category: "A",
        checked_in: false,
        username: "John Doe",
        checkInDate: null,
    };
    return ticket;
    return res.json();
};

export default async function TicketVerifierPage({ params }: PageProps) {
    const ticket: Ticket = await fetchTicket(params.id);
    return <TicketVerifier userTicket={ticket} />;
}
