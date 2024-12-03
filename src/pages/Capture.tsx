import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import Popup from "@/components/Popup";
import { Doc } from "@/models/Document";
import { addProspect, DefaultProspect, Prospect, uploadFiles } from "@/models/Prospect";
import { useState } from "react";

const Capture = () => {
  const [prospect, setProspect] = useState<Prospect>(DefaultProspect);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [showFileError, setShowFileError] = useState(false);
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getNextId = () => {
    return documents.length > 0
      ? Math.max(...documents.map((doc) => doc.id)) + 1
      : 1;
  };

  const handleFileAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size > 10 * 1024 * 1024) {
      setShowFileError(true);
    } else {
      setShowFileError(false);

      if (file) {
        const newDocument: Doc = {
          id: getNextId(),
          prospectId: 0,
          name: file.name,
          document: file,
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
    if (prospect.name || prospect.lastName || prospect.phone) {
      setShowEmptyError(false);
      setIsLoading(true);

      const addedProspect = await addProspect(prospect);

      if (addedProspect && documents.length > 0) {
          await uploadFiles(addedProspect.id, documents);
      }
      setProspect(DefaultProspect);
      setIsLoading(false);
    } else {
      setShowEmptyError(true);
    }
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
            maxLength={50}
            onChange={handleInputChange("name")}
            className="w-full px-4 py-3 rounded-xl bg-background-2 placeholder:text-foreground-4 outline-none"
          />
          <input
            type="text"
            placeholder="Primer Apellido *"
            value={prospect.lastName}
            maxLength={50}
            onChange={handleInputChange("lastName")}
            className="w-full px-4 py-3 rounded-xl bg-background-2 placeholder:text-foreground-4 outline-none"
          />
          <input
            type="text"
            placeholder="Segundo Apellido"
            maxLength={50}
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
              {document.name}
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

      {/* Save Button */}
      <button
        className="bg-primary-1 px-4 py-2 rounded-xl max-w-fit self-center"
        onClick={handleSaveProspect}
      >
        Guardar
      </button>

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
        message="File should be 10MB or less"
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
