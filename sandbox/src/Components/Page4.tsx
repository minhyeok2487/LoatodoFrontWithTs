import React, { FC, useEffect, useState } from "react";
import Ad from "../Modules/Ad";

const Page4: FC = () => {
  const [num, setNum] = useState(2);
  const loadMore = () => {
    setNum(num + 1);
  };
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [num]);
  const it = (max: number) => {
    const r = [];
    for (var i = 1; i <= max; i++) {
      r.push(i);
    }
    return r;
  };

  return (
    <>
      <h3> Infinite Scroll</h3>
      <div id="content-container">
        {it(num).map((_item, i) => {
          return (
            <div className="grid-container" key={_item}>
              <div className="grid-item a">
                <Ad placementName="billboard" />
              </div>
              <div className="grid-item b">B</div>
              <div className="grid-item c">C</div>
              <div className="grid-item d">
                <Ad placementName="mpu" />
              </div>
              <div className="grid-item e">E</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Page4;
