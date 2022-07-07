import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Modal from "@material-tailwind/react/Modal";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Header from "../components/Header";
import DocumentRow from "../components/DocumentRow";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserEmail,
  selectUserName,
  selectUserPhotoUrl,
  setActiveUser,
} from "../features/userSlice";
import {
  collection,
  orderBy,
  serverTimestamp,
  getDocs,
  where,
  addDoc,
  query,
} from "firebase/firestore";
import { auth, db, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function Home() {
  // Global user state data
  const user = {
    username: useSelector(selectUserName),
    email: useSelector(selectUserEmail),
    photoUrl: useSelector(selectUserPhotoUrl),
  };

  // Call getFiles to fetch user docs on first render
  useEffect(() => {
    if (user.username) {
      getFiles(user.email);
    }
  }, [user.email]);

  const dispatch = useDispatch();

  // Define new document name state
  const [fileName, setFileName] = useState("");

  // Define fetched user documents array state
  var [userFiles, setUserFiles] = useState([]);

  // Define Modal visibility state
  const [showModal, setShowModal] = useState(false);

  // Create File Button logic
  function CreateFileButton() {
    if (user.username) setShowModal(true);
    else {
      signInWithPopup(auth, provider)
        .then((result) => {
          dispatch(
            setActiveUser({
              userName: result.user.displayName,
              userEmail: result.user.email,
              photoUrl: result.user.photoURL,
            })
          );
        })
        .then((res) => {
          console.log(res);
          setShowModal(true);
        })
        .catch((error) => console.log(error));
    }
  }

  // Create new document logic
  async function createFile() {
    try {
      const docRef = await addDoc(collection(db, "docs"), {
        email: user.email,
        title: fileName,
        content: "",
        lastUpdated: serverTimestamp(),
      });
      setShowModal(false);
      setFileName("");
      getFiles(user.email);

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Fetch user documents logic
  async function getFiles(email) {
    setUserFiles([]);

    const querySnapshot = await getDocs(
      query(
        collection(db, "docs"),
        where("email", "==", email),
        orderBy("lastUpdated", "desc")
      )
    );

    querySnapshot.forEach((doc) => {
      setUserFiles((userFiles) => [...userFiles, doc]);
      console.log(doc.id, "=>", doc.data());
    });
  }

  // Define modal component
  const modal = (
    <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
      <ModalBody>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="outline-none w-full"
          placeholder="إدخل إسم الملف..."
          onKeyDown={(e) => e.key === "Enter" && createFile()}
        />
      </ModalBody>

      <ModalFooter>
        <Button
          color="blue"
          buttonType="link"
          onClick={() => setShowModal(false)}
          ripple="dark"
        >
          إلغاء
        </Button>
        <Button onClick={() => createFile()} color="blue" ripple="light">
          إنشاء
        </Button>
      </ModalFooter>
    </Modal>
  );
  return (
    <div>
      <Header />

      {modal}

      <section className="bg-[#F8F9FA] pb-10 px-10">
        <div className="max-w-3xl m-auto">
          <div className="flex items-center justify-between py-6">
            <h2 className="text-gray-700 text-lg">إنشاء ملف جديد</h2>
          </div>
          <div>
            <div
              onClick={() => CreateFileButton()}
              className="relative h-52 w-40 border-2 cursor-pointer hover:border-blue-700"
            >
              <img src="https://links.papareact.com/pju" alt="" layout="fill" />
            </div>

            <p className="ml-2 mt-2 font-semibold text-sm text-gray-700">
              خالى
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-10 md:px-8">
        <div className="max-w-3xl mx-auto py-8 text-sm text-gray-700">
          <div className="flex items-center justify-between pb-5">
            <h2 className="font-medium flex-grow">إسم الملف</h2>
            <p className="mr-12">تاريخ الإنشاء</p>
            <Icon name="folder" size="3xl" color="gray" />
          </div>

          {user.username ? (
            userFiles?.map((doc) => (
              <DocumentRow
                className="ml-auto"
                key={doc.id}
                id={doc.id}
                fileName={doc.data().title}
                date={doc.data().lastUpdated}
                fileContent={doc.data().content}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
