import ListEvents from "../../api/calendar/events/ListEvents";
import { Spinner } from "react-bootstrap";
import Button from "../../Components/Button";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { EventTableStyle } from "./EventTable.style";
import { endOfWeek, format, parseISO } from "date-fns";
import DeleteEvents from "../../api/calendar/events/DeleteEvents";

export const EventTable = ({
  calendar,
  count = null,
  startDate = new Date().toISOString(),
  endDate = endOfWeek(new Date()).toISOString(),
}) => {
  const queryClient = useQueryClient();
  const { data: events, isLoading: isLoadingEvents } = useQuery(
    ["events", calendar, count, startDate, endDate],
    () => ListEvents(calendar, count, startDate, endDate)
  );

  const deleteEvent = useMutation((data) => DeleteEvents(calendar, data.id), {
    onSuccess: () => {
      queryClient.invalidateQueries("events");
    },
  });
  return (
    <>
      {isLoadingEvents ? (
        <Spinner className="mt-5" animation="border" variant="success" />
      ) : (
        <EventTableStyle className="mt-4" striped bordered>
          <thead>
            <tr>
              <th>Naziv dogadaja</th>
              <th>Datum pocetka dogadaja</th>
              <th>Datum zavrsetka dogadaja</th>
            </tr>
          </thead>
          <tbody>
            {events?.items.map((e) => (
              <tr key={e.id}>
                <td>{e.summary}</td>
                <td>
                  {format(parseISO(e.start.dateTime), "PP HH:mm")}
                </td>
                <td>{format(parseISO(e.end.dateTime), "PP HH:mm")}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => deleteEvent.mutate(e)}
                  >
                    Obrisi
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </EventTableStyle>
      )}
    </>
  );
};
