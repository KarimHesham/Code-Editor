import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import { Controlled as CodeMirror } from "react-codemirror2";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import "../css/codemirror.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/arab.css";
import 'codemirror/addon/lint/lint.css'
import "codemirror/mode/arab/arab.js";
import "codemirror/addon/display/placeholder.js";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/hint/javascript-hint.js";
import Header from "./Header";
import { signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveUser,
  selectUserName,
  selectUserEmail,
  selectUserPhotoUrl,
} from "../features/userSlice";
import {
  selectFileContent,
  selectFileId,
  selectFileTitle,
  setActiveFile,
} from "../features/fileSlice";
import { auth, db, provider } from "../firebase";
import {
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { ListItemText, Menu, MenuItem } from "@mui/material";
// import jsonData from "../examples/examples.json";

// const loadData = JSON.parse(JSON.stringify(jsonData));

function Editor() {
  // Define URL for compiler web service
  const webServiceURL =
    "http://waleedbaz-002-site4.htempurl.com/WebServices/test";

  // History state
  const navigate = useNavigate();

  // Redux global state
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Global user state data
  const user = {
    username: useSelector(selectUserName),
    email: useSelector(selectUserEmail),
    photoUrl: useSelector(selectUserPhotoUrl),
  };

  // Editor content global data
  const file = {
    fileId: useSelector(selectFileId),
    fileTitle: useSelector(selectFileTitle),
    fileContent: useSelector(selectFileContent),
  };

  // Define text areas content states
  const [input, setInput] = useState(file.fileContent);
  const [output, setOutput] = useState();
  const [error, setError] = useState();

  // Define Editor Mode state
  const [mode, setMode] = useState(false);

  // Define Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Define Modals visibility state
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);

  // Define Modal input state
  const [modalInput, setModalInput] = useState("");

  // Home Button logic
  function HomeButton() {
    if (user.username) navigate("/home");
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
          navigate("/home");
        })
        .catch((error) => console.log(error));
    }
  }

  // Save file logic
  function SaveFile() {
    if (user.username && file.fileTitle) {
      setModalInput(file.fileTitle);
      setShowCreateFileModal(true);
    } else if (user.username && !file.fileTitle) setShowCreateFileModal(true);
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
          setShowCreateFileModal(true);
        })
        .catch((error) => console.log(error));
    }
  }

  // Create new document logic
  async function createFile() {
    try {
      const docRef = await addDoc(collection(db, "docs"), {
        email: user.email,
        title: modalInput,
        content: input,
        lastUpdated: serverTimestamp(),
      });
      setShowCreateFileModal(false);
      setModalInput("");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Update document logic
  async function updateFile() {
    try {
      const docRef = await updateDoc(doc(db, "docs", file.fileId), {
        email: user.email,
        title: modalInput,
        content: input,
        lastUpdated: serverTimestamp(),
      });
      setShowCreateFileModal(false);
      console.log("Document updated with ID: ", docRef.id);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  // Load examples logic
  async function loadExamples(index) {
    const url =
      "http://waleedbaz-002-site1.htempurl.com/new/examples/example" +
      index +
      ".json";

    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        dispatch(
          setActiveFile({
            title: "example" + index,
            content: result.content,
          })
        );
        setInput(result.content);
      })
      .catch((error) => console.error(error));
  }

  // Run code logic
  function RunCode(text) {
    var bodyFormData = new FormData();
    bodyFormData.append("data", text);
    setIsLoading(true);
    console.log(text);
    axios({
      method: "POST",
      url: webServiceURL,
      data: bodyFormData,
    })
      .then((response) => {
        console.log(response.data);
        setOutput(response.data.outputMessage);
        setError(response.data.errorMessage);
        setIsLoading(false);
      })
      .then(() => {
        if (mode) setShowOutputModal(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Define output modal component
  const outputModal = (
    <Modal
      className="h-full"
      active={showOutputModal}
      toggler={() => setShowOutputModal(false)}
    >
      <ModalHeader className="" toggler={() => setShowOutputModal(false)}>
        <p className="mt-4">نتيجه التشغيل</p>
      </ModalHeader>
      <ModalBody>
        <textarea
          className="h-screen w-screen"
          name="modalOutput"
          type="text"
          disabled
        >
          {output + error}
        </textarea>
      </ModalBody>
    </Modal>
  );

  // Define create file modal
  const createFileModal = (
    <Modal
      size="sm"
      active={showCreateFileModal}
      toggler={() => setShowCreateFileModal(false)}
    >
      <ModalBody>
        <input
          type="text"
          value={modalInput}
          onChange={(e) => setModalInput(e.target.value)}
          className="outline-none w-full"
          placeholder="إدخل إسم الملف..."
          onKeyDown={(e) => e.key === "Enter" && createFile()}
        />
      </ModalBody>

      <ModalFooter>
        <Button
          color="blue"
          buttonType="link"
          onClick={(e) => setShowCreateFileModal(false)}
          ripple="dark"
        >
          إلغاء
        </Button>
        <Button
          color="blue"
          ripple="light"
          onClick={() => (file.fileTitle ? updateFile() : createFile())}
        >
          {file.fileTitle ? "حفظ" : "إنشاء"}
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div>
      <Header />

      <div className="bg-[#F8F9FA] ">
        {/*Buttons Tab */}
        <div className="px-0.2 h-14 flex justify-center items-center">
          <div className="ml-2">
            <Button
              color="blue"
              buttonType="outline"
              rounded={true}
              iconOnly={true}
              ripple="dark"
              className="inline-flex h-20 w-20 border-none"
              onClick={() => HomeButton()}
            >
              <Icon name="home" size="3xl" />
            </Button>
            <Button
              color="blue"
              buttonType="outline"
              rounded={true}
              iconOnly={true}
              ripple="dark"
              className="inline-flex h-20 w-20 border-none"
              onClick={() => (mode ? setMode(false) : setMode(true))}
            >
              <Icon name="developer_mode" size="3xl" />
            </Button>

            <Button
              color="blue"
              buttonType="outline"
              rounded={true}
              iconOnly={true}
              ripple="dark"
              className="inline-flex h-20 w-20 border-none"
              onClick={() => SaveFile()}
            >
              <Icon name="save" size="3xl" />
            </Button>

            <Button
              color="blue"
              buttonType="outline"
              rounded={true}
              iconOnly={true}
              ripple="dark"
              className="inline-flex h-20 w-20 border-none"
              onClick={handleClick}
            >
              <Icon name="example" size="3xl" />
            </Button>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={() => loadExamples("1")}>
                <ListItemText>مثال 1</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => loadExamples("2")}>
                <ListItemText>مثال 2</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => loadExamples("3")}>
                <ListItemText>مثال 3</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => loadExamples("4")}>
                <ListItemText>مثال 4</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => loadExamples("5")}>
                <ListItemText>مثال 5</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => loadExamples("6")}>
                <ListItemText>مثال 6</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => loadExamples("7")}>
                <ListItemText>مثال 7</ListItemText>
              </MenuItem>
            </Menu>
          </div>

          <Button
            color="blue"
            buttonType="fill"
            rounded={true}
            ripple="dark"
            className="md:inline-flex h-10 border-none"
            onClick={() => RunCode(input)}
          >
            تشغيل
            <Icon name="keyboard_arrow_left" size="3xl" />
          </Button>
        </div>

        {createFileModal}

        {/* Editor Section */}
        <div className="mx-4">
          <CodeMirror
            className="shadow-md text-md"
            value={input}
            options={{
              mode: "javascript",
              theme: "eclipse",
              lineNumbers: true,
              placeholder: "ابدأ الكتابه من هنا...",
              direction: "rtl",
              rtlMoveVisually: true,
              lint: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setInput(value);
            }}
            onChange={(editor, data, value) => setInput(value)}
          />
          {isLoading && (
            <CircularProgress className="absolute top-1/2 right-1/2 z-20" />
          )}

          {mode ? (
            <div>{outputModal}</div>
          ) : (
            <div className="flex mt-2 py-4">
              <textarea
                value={output}
                className="flex-grow outline-none font-bold text-sm
       text-gray-600 shadow-md placeholder-gray-700 w-1/2 h-96 ml-4"
                type="text"
                disabled
                placeholder="  نتيجة التشغيل تظهر هنا..."
              />
              <textarea
                value={error}
                disabled
                className="flex-grow shadow-md font-bold outline-none text-sm pt-1
       text-red-600 placeholder-gray-700 w-1/2 h-96 "
                placeholder="  الأخطاء تظهر هنا..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;
