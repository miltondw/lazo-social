import Head from "next/head";
import { useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import Link from "next/link";
import Image from "next/image";

export default function Users() {
  const { state, dispatch } = useContext(DataContext);
  const { users, auth, modal } = state;

  if (!auth.user) return null;
  return (
    <div className="table-responsive">
      <Head>
        <title>Users</title>
      </Head>

      <table className="table w-100">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user._id} style={{ cursor: "pointer" }}>
              <th>{index + 1}</th>
              <th>{user._id}</th>
              <th>
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width="30"
                  height="30"
                  style={{
                    overflow: "hidden",
                    objectFit: "cover",
                  }}
                />
              </th>
              <th>{user.name}</th>
              <th>{user.email}</th>
              <th>
                {user.role === "admin" ? (
                  user.root ? (
                    <i className="fas fa-check text-success"> Root</i>
                  ) : (
                    <i className="fas fa-check text-success"></i>
                  )
                ) : (
                  <i className="fas fa-times text-danger"></i>
                )}
              </th>
              <th>
                <Link
                  href={
                    auth.user.root && auth.user.email !== user.email
                      ? `/edit_user/${user._id}`
                      : "#!"
                  }
                >
                  <a>
                    <i className="fas fa-edit text-info mr-2" title="Edit"></i>
                  </a>
                </Link>

                {auth.user.root && auth.user.email !== user.email ? (
                  <i
                    className="far fa-trash-alt text-danger ml-2 p-2"
                    aria-hidden="true"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => {
                      dispatch({
                        type: "ADD_MODAL",
                        payload: [
                          {
                            data: users,
                            id: user._id,
                            title: user.name,
                            type: "ADD_USERS",
                          },
                        ],
                      });
                    }}
                  ></i>
                ) : (
                  <i
                    className="fas fa-trash-alt text-danger ml-2 p-2"
                    title="Remove"
                  ></i>
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
