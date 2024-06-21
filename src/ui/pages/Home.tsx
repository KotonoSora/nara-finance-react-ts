import React from "react";

import { MyButton, MyTitle } from "@kotonosora/nara-ui-library";

const Home: React.FC = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <div>huhu bug</div>
      <MyTitle label="title from library " />
      <MyButton primary label="button from library" />
    </div>
  );
};

export default Home;
