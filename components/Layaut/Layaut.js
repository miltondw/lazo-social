import Navbar from "../Navbar/Navbar";
import Notify from "../Notify/Notify";
import Modal from "../Modal/Modal";
export default function Layaut({ children }) {
  return (
    <div className="container">
      <Navbar />
      <Notify />
      <Modal />
      {children}
    </div>
  );
}
