import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import Popup from "@/components/Popup";
import YesNoPopup from "@/components/YesNoPopup";
import { Doc } from "@/models/Document";
import {
  addProspect,
  DefaultProspect,
  Prospect,
  statuses,
  uploadFiles,
} from "@/models/Prospect";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Capture = () => {
  const [prospect, setProspect] = useState<Prospect>(DefaultProspect);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [showFileError, setShowFileError] = useState(false);
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const navigate = useNavigate();

  const getNextId = () => {
    return documents.length > 0
      ? Math.max(...documents.map((doc) => doc.id)) + 1
      : 1;
  };

  const handleFileAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size > 4 * 1024 * 1024) {
      setShowFileError(true);
    } else {
      setShowFileError(false);

      if (file) {
        const newDocument: Doc = {
          id: getNextId(),
          prospectId: 0,
          name: file.name,
          document: file,
          docName: file.name,
        };

        setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
      }
    }
  };

  type InputChangeHandler = (
    field: keyof Prospect
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;

  const handleInputChange: InputChangeHandler = (field) => (e) => {
    let value = e.target.value;

    if (
      field === "name" ||
      field === "lastName" ||
      field === "secondLastName"
    ) {
      if (value.length > 50) {
        value = value.slice(0, 50);
      }
      value = value.replace(/[^a-zA-Z\s]/g, "");
    }

    if (field === "phone") {
      if (value.length > 15) {
        value = value.slice(0, 15);
      }
      value = value.replace(/[^0-9]/g, "");
    }

    setProspect((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleRemoveFile = (document: Doc) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((doc) => doc.id !== document.id)
    );
  };

  const handleSaveProspect = async () => {
    if (
      prospect.name.length > 0 &&
      prospect.lastName.length > 0 &&
      prospect.phone.length > 0
    ) {
      if (documents.length > 0) {
        for (const document of documents) {
          if (document.name.length === 0) {
            setShowEmptyError(true);
            return;
          }
        }
      }

      setShowEmptyError(false);
      setIsLoading(true);

      const addedProspect = await addProspect(prospect);

      if (addedProspect && documents.length > 0) {
        await uploadFiles(addedProspect.id, documents);
      }

      setDocuments([]);
      setProspect(DefaultProspect);
      setIsLoading(false);
      setShowSuccessPopup(true);
    } else {
      setShowEmptyError(true);
    }
  };

  const handleRoleDropDown = (status: number) => {
    setProspect((prevState) => ({
      ...prevState,
      ["status"]: status,
    }));
    setIsDropDownOpen(false);
  };

  const handleExit = () => {
    setShowExitWarning(false);
    setDocuments([]);
    setProspect(DefaultProspect);
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-12 m-10 md:m-20 md:p-20">
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <div className="flex flex-col gap-4 items-center">
          <div className="rounded-full h-20 w-20 flex items-center justify-center bg-background-4 aspect-square text-2xl">
            {prospect.name?.trim() ? (
              prospect.name.charAt(0).toUpperCase()
            ) : (
              <Icon
                icon="person"
                className="text-foreground-3"
                style={{ fontSize: "40px" }}
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => document.getElementById("fileInput")?.click()}
            className="justify-center flex rounded-xl px-4 py-2 bg-primary-1 font-medium sm:text-sm self-center gap-2"
          >
            <Icon
              icon="upload_file"
              className="text-foreground-1 self-center"
              style={{ fontSize: "18px" }}
            />
            Documento
          </button>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileAdd}
            accept="*"
          />
        </div>
        {/* Form Fields */}
        <div className="flex flex-col gap-2 w-full md:-me-10 md:max-w-screen-md">
          <input
            type="text"
            placeholder="Name *"
            value={prospect.name}
            maxLength={100}
            onChange={handleInputChange("name")}
            className="w-full px-4 py-3 rounded-xl bg-background-2 placeholder:text-foreground-4 outline-none"
          />
          <input
            type="text"
            placeholder="Primer Apellido *"
            value={prospect.lastName}
            maxLength={100}
            onChange={handleInputChange("lastName")}
            className="w-full px-4 py-3 rounded-xl bg-background-2 placeholder:text-foreground-4 outline-none"
          />
          <input
            type="text"
            placeholder="Segundo Apellido"
            maxLength={100}
            value={prospect.secondLastName}
            onChange={handleInputChange("secondLastName")}
            className="w-full px-4 py-3 rounded-xl bg-background-2 placeholder:text-foreground-4 outline-none"
          />
          <input
            type="phone"
            placeholder="Teléfono *"
            value={prospect.phone}
            maxLength={15}
            onChange={handleInputChange("phone")}
            className="w-full px-4 py-3 rounded-xl bg-background-2 placeholder:text-foreground-4 outline-none"
          />

          {/* Dropdown Status */}
          <button
            onClick={() => setIsDropDownOpen(!isDropDownOpen)}
            className={`${
              statuses.find((status) => status.id === prospect.status)?.id === 1
                ? "bg-primary-1"
                : statuses.find((status) => status.id === prospect.status)
                      ?.id === 2
                  ? "bg-green-700"
                  : statuses.find((status) => status.id === prospect.status)
                        ?.id === 3
                    ? "bg-red-500"
                    : "bg-background-2"
            } font-medium rounded-xl px-4 py-3 text-center flex items-center flex-row gap-1`}
            type="button"
          >
            {statuses.find((status) => status.id === prospect.status)?.name}
            <Icon icon="keyboard_arrow_down" />
          </button>
          <div
            className={`${isDropDownOpen ? "visible" : "hidden"} z-10 bg-background-2 rounded-xl shadow w-44`}
          >
            <ul className="text-s flex flex-col gap-1">
              {statuses.map((status) => (
                <li
                  key={status.id}
                  className="flex flex-row px-4 py-2 cursor-pointer"
                  onClick={() => handleRoleDropDown(status.id)}
                >
                  <span
                    className={`px-2 rounded-xl hover:cursor-pointer flex flex-row w-full items-center justify-center ${
                      status.id === 1
                        ? "bg-primary-1"
                        : status.id === 2
                          ? "bg-green-700"
                          : status.id === 3
                            ? "bg-red-500"
                            : ""
                    }`}
                  >
                    {status.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="flex flex-col gap-2">
        {documents.map((document) => (
          <div
            key={document.id}
            className="max-w-screen-lg self-center bg-background-1 rounded-xl flex flex-row items-center justify-between px-5 py-2 gap-2"
          >
            <Icon
              icon="description"
              className="text-foreground-4 self-center align-middle"
              style={{ fontSize: "20px" }}
            />
            <span className="text-foreground-4 text-sm font-medium">
              <input
                type="text"
                className="bg-background-4 py-1 rounded-lg px-3 outline-none"
                value={document.name}
                onChange={(e) => {
                  setDocuments((prevDocuments) =>
                    prevDocuments.map((doc) =>
                      doc.id === document.id
                        ? { ...doc, name: e.target.value }
                        : doc
                    )
                  );
                }}
              />
            </span>
            <button onClick={() => handleRemoveFile(document)}>
              <Icon
                icon="remove"
                className="bg-primary-1 rounded-full text-foreground-1 self-center align-middle ms-2"
                style={{ fontSize: "20px" }}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-row gap-4 justify-center">
        {/* Exit Button */}
        <button
          className="bg-background-1 px-4 py-2 rounded-xl max-w-fit self-center"
          onClick={() => setShowExitWarning(true)}
        >
          Salir
        </button>

        {/* Save Button */}
        <button
          className="bg-primary-1 px-4 py-2 rounded-xl max-w-fit self-center"
          onClick={handleSaveProspect}
        >
          Guardar
        </button>
      </div>

      {/* Exit Warning */}
      <YesNoPopup
        title="Alerta"
        visible={showExitWarning}
        message="Si sales se perdera toda la informacion agregada"
        icon="info"
        onConfirm={handleExit}
        onCancel={() => setShowExitWarning(false)}
      />

      {/* Saved Prospect Popup */}
      <Popup
        title="Correcto"
        visible={showSuccessPopup}
        message="Prospecto guardado correctamente"
        icon="check"
        onConfirm={() => setShowSuccessPopup(false)}
        onCancel={() => setShowSuccessPopup(false)}
      />

      {/* Empty Fields Error */}
      <Popup
        title="Error"
        visible={showEmptyError}
        message="Llena todos los campos obligatorios (*)"
        icon="error"
        onConfirm={() => setShowEmptyError(false)}
        onCancel={() => setShowEmptyError(false)}
      />

      {/* File Size Error */}
      <Popup
        title="Error"
        visible={showFileError}
        message="File should be 4MB or less"
        icon="error"
        onConfirm={() => setShowFileError(false)}
        onCancel={() => setShowFileError(false)}
      />

      {/* Loading */}
      <Loading visible={isLoading} />
    </div>
  );
};

export default Capture;
