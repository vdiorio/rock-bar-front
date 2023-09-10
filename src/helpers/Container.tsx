import React from "react";
import ReactLoading from "react-loading";

interface Props extends React.PropsWithChildren {
  isLoading: boolean;
}

export default function Container({ isLoading, children }: Props) {
  return (
    <>
      {isLoading ? (
        <ReactLoading color={"black"} height={"20%"} width={"20%"} />
      ) : (
        <div className="container">{children}</div>
      )}
    </>
  );
}
