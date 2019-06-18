import React from "react";
import Spinner from "react-bootstrap/Spinner";

import Alert from "react-bootstrap/Alert";
// import ReactDOM from "react-dom";
// import singleSpaReact from "single-spa-react";
//import dayjs from "dayjs";

export default function Root(props: RootProps) {
  const [visits, setVisits] = React.useState([]);

  const [isBusy, setIsBusy] = React.useState(false);

  React.useEffect(() => {
    var requestString = `/openmrs/ws/rest/v1/visit?patient=${props.patientUuid}&v=full`;
    // console.log('visit request', requestString);
    // console.log('props', props);
    setIsBusy(true);
    fetch(requestString)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error(
            `Cannot fetch visits for ${props.patientUuid} - server responded with '${resp.status}'`
          );
        }
      })
      .then(resp => {
        setVisits(resp.results);
      })
      .finally(() => {
        setIsBusy(false);
      });
  }, []);

  return !isBusy ? renderVisits() : renderLoader();

  function renderLoader() {
    return <Spinner animation="border" />;
  }

  function renderVisits() {
    if (visits.length === 0) {
      return (
        <Alert key={1} variant={"warning"}>
          No visits for patient
        </Alert>
      );
    }

    const listItems = visits.map(visit => <div>{visit.display}</div>);

    return (
      <div>
        <div>Recent Visits</div>
        {listItems}
      </div>
    );
  }
}

type RootProps = {
  patientUuid: string;
};
