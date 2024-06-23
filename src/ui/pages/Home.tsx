import React from "react";

import { MyButton, MyTitle, Typography } from "@kotonosora/nara-ui-library";

const Home: React.FC = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <div>huhu bug</div>
      <MyTitle label="title from library " />
      <MyButton primary label="button from library" />
      <Typography text={`Typography here weight 400`} theme="default" />
      <Typography
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam blanditiis, magni at minima, minus sunt ullam doloremque vitae aperiam excepturi suscipit ipsum? Voluptatibus nisi explicabo atque illo, distinctio nam tenetur!"
        weight={800}
      />
    </div>
  );
};

export default Home;
