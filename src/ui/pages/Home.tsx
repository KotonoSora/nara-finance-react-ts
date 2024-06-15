import React from "react";

import Hello from "@library/components/Hello";
import { ButtonTest } from "@library-components/ButtonTest";

const Home: React.FC = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <Hello />
      <ButtonTest primary label="button from library" />
    </div>
  );
};

export default Home;
