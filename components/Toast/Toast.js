export default function Toast({ msg, handleShow, bgColor }) {
  return (
    <div
      className={"toast show align-items-center text-light " + bgColor}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">
          <p className="m-0">{msg}</p>
        </div>
        <button
          type="button"
          className="btn-close me-2 m-auto text-light"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={handleShow}
          style={{ outline: "none" }}
        ></button>
      </div>
    </div>
  );
}
