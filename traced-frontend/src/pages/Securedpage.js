import React from "react";

import { apiFetch } from "../helpers/api";
import PersonsList from "../components/PersonList";
import TracingButton from "../components/TracingButton";
import { traceSpan } from "../helpers/tracing";

const SecuredPage = () => {
  const [persons, setPersons] = React.useState([]);

  const fetchPersons = async () => {
    setPersons([]);
    try {
      const persons = await apiFetch(`https://api.publicapis.org/entries`);
      traceSpan("persons", () => {
        setPersons(persons.entries);
      });
    } catch (e) {
      traceSpan("error", () => {
        console.error("error occured during the trace export");
      });
    }
  };

  return (
    <div>
      <header>
        <h1 className="text-black text-4xl">Welcome to the Protected Page.</h1>
      </header>

      <TracingButton
        id="test-fetch-persons-button"
        label={"Fetch Links"}
        onClick={fetchPersons}
      />
      {persons.length > 0 && (
        <React.Fragment>
          <div id="test-persons-count-text">Found {persons.length} persons</div>
          <PersonsList persons={persons} />
        </React.Fragment>
      )}
    </div>
  );
};

export default SecuredPage;
