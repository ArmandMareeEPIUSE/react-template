import React from 'react';
import {
  Dialog,
  DialogHeader,
  IconButton,
  DialogBody,
  Typography,
  DialogFooter,
} from '@material-tailwind/react';
import { Form, useSubmit } from 'react-router-dom';

export interface FieldConfig {
  name: string;
  label: string;
  defaultValue: string;
  required: boolean;
  autoGenerateFunction?: () => string;
}

export type FieldsConfig = FieldConfig[];

export function AddButtonModal({
  entityName,
  fields: fieldsConfig,
}: {
  entityName: string;
  fields: FieldsConfig;
}) {
  const [open, setOpen] = React.useState(false);
  const [fields, setFields] = React.useState<{ [fieldName: string]: string }>(
    fieldsConfig.reduce((acc, field) => {
      return {
        ...acc,
        [field.name]: field.defaultValue,
      };
    }, {}),
  );

  const submit = useSubmit();

  const handleOpen = () => setOpen((cur) => !cur);
  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <button
        onClick={handleOpen}
        className="flex select-none items-center gap-3 rounded-lg bg-eu-red py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          strokeWidth="2"
          className="w-4 h-4"
        >
          <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"></path>
        </svg>
        Add {entityName}
      </button>
      <Dialog className="p-4" size="md" open={open} handler={handleOpen}>
        <DialogHeader className="justify-between">
          <Typography
            className="mb-1 font-bold fs flex items-center text-eu-heading"
            variant="h3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 mr-2"
            >
              <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
            </svg>
            Add {entityName}
          </Typography>
          <IconButton
            color="gray"
            size="sm"
            variant="text"
            onClick={handleOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody className="overflow-y-scroll">
          <Form
            id="create-form"
            method="post"
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              submit(event.currentTarget);
              setOpen(false);
            }}
          >
            {Object.entries(fields).map(([fieldName, value]) => {
              const config = fieldsConfig.find((f) => f.name === fieldName);

              return (
                <div className="w-full max-w-md min-w-[200px]" key={fieldName}>
                  <Typography
                    variant="small"
                    className="mt-6 mb-2 text-eu-body font-normal"
                  >
                    {config?.label}
                  </Typography>
                  <div className="flex items-center">
                    <input
                      name={fieldName}
                      className="w-full bg-transparent text-eu-body placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                      placeholder="Type here..."
                      value={value}
                      onChange={handleOnInputChange}
                      required={config?.required}
                    />
                    {config?.autoGenerateFunction ? (
                      <IconButton
                        size="sm"
                        variant="text"
                        className="text-eu-body"
                        onClick={() => {
                          if (!config?.autoGenerateFunction) {
                            return;
                          }
                          setFields({
                            ...fields,
                            [fieldName]: config.autoGenerateFunction(),
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 m-2"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 5.25c1.213 0 2.415.046 3.605.135a3.256 3.256 0 0 1 3.01 3.01c.044.583.077 1.17.1 1.759L17.03 8.47a.75.75 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 0 0-1.06-1.06l-1.752 1.751c-.023-.65-.06-1.296-.108-1.939a4.756 4.756 0 0 0-4.392-4.392 49.422 49.422 0 0 0-7.436 0A4.756 4.756 0 0 0 3.89 8.282c-.017.224-.033.447-.046.672a.75.75 0 1 0 1.497.092c.013-.217.028-.434.044-.651a3.256 3.256 0 0 1 3.01-3.01c1.19-.09 2.392-.135 3.605-.135Zm-6.97 6.22a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.752-1.751c.023.65.06 1.296.108 1.939a4.756 4.756 0 0 0 4.392 4.392 49.413 49.413 0 0 0 7.436 0 4.756 4.756 0 0 0 4.392-4.392c.017-.223.032-.447.046-.672a.75.75 0 0 0-1.497-.092c-.013.217-.028.434-.044.651a3.256 3.256 0 0 1-3.01 3.01 47.953 47.953 0 0 1-7.21 0 3.256 3.256 0 0 1-3.01-3.01 47.759 47.759 0 0 1-.1-1.759L6.97 15.53a.75.75 0 0 0 1.06-1.06l-3-3Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </IconButton>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </Form>
        </DialogBody>
        <DialogFooter>
          <button
            data-dialog-close="true"
            className="rounded-md text-eu-body border border-transparent py-2 px-4 text-center font-sans text-xs font-bold uppercase transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleOpen}
          >
            Cancel
          </button>
          <button
            data-dialog-close="true"
            className="rounded-md bg-eu-red py-2 px-4 border border-transparent text-center font-sans text-xs font-bold uppercase text-white shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="submit"
            form="create-form"
          >
            Confirm
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
