import React, { useState, useEffect } from "react";

import ColumnScreen from '../ColumnScreen';
import SpaceInfo from '../SpaceInfo';
import BackButton from '../BackButton';
import Configuration from "../Configuration";
import ProtectContent from "../ProtectContent";

const Config = ({ navigate, goBack, resetToHome, params }) => {
  const [access, setAccess] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      resetToHome();
    }, 1000 * 60 * 15);

    return () => clearTimeout(timerId);
  }, []);

  if (!access) return (<ProtectContent setAccess={setAccess} goBack={goBack} />);

  return (
    <ColumnScreen
      leftContent={<SpaceInfo navigate={navigate} />}
      rightContent={
        <>
          <BackButton goBack={resetToHome} />
          <Configuration navigate={navigate} />
        </>
      }
    />
  );
};

export default Config;