import { useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import Loading from "../Loading/Loading";
import Toast from "../Toast/Toast";

const Notify = () => {
  const {state, dispatch} = useContext(DataContext);
  const { notify } = state;


  return (
    <>
      {notify.loading && <Loading />}
      {notify.error && (
        <Toast
          msg={notify.error}
          handleShow={() => dispatch({ type: "NOTIFY", payload: {} })}
          bgColor="bg-danger"
        />
      )}
      {notify.success && (
        <Toast
          msg={notify.success}
          handleShow={() => dispatch({ type: "NOTIFY", payload: {} })}
          bgColor="bg-success"
        />
      )}
    </>
  );
};

export default Notify;
