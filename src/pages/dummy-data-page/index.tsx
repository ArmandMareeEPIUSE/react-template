import { Typography } from '@material-tailwind/react';
import { useActionData, useLoaderData } from 'react-router-dom';
import React, { useState } from 'react';
import { Dummy } from './models';
import constants from '../../constants';
import {
  AddButtonModal,
  FieldsConfig,
} from '../../components/modals/add-button-modal';
import {
  TableHeadings,
  TableRowDatas,
  TableWithSearch,
} from '../../components/tables/table-with-search';

interface DummiesLoaderData {
  dummies: Dummy[];
  loadErrorMessage?: string;
}

export async function dummiesLoader(): Promise<DummiesLoaderData> {
  let dummies: Dummy[] = [];
  let loadErrorMessage: string | undefined;

  try {
    const response = await fetch(`${constants.server.url}/api/dummies`);

    if (!response.ok) {
      throw new Error('Failed to get dummies.', {
        cause: await response.text(),
      });
    }

    dummies = await response.json();
  } catch (error: any) {
    loadErrorMessage = `Failed to get dummies. Cause: ${error.message}`;
    console.log(error);
  }

  return {
    dummies,
    loadErrorMessage,
  };
}

interface DummiesActionData {
  success: boolean;
  loadErrorMessage?: string;
}

export async function dummiesAction({ request }: { request: Request }) {
  const formData = await request.formData();
  let success = false;
  let loadErrorMessage: string | undefined;

  try {
    const body = {
      name: formData.get('name'),
    };

    const response = await fetch(`${constants.server.url}/api/dummies`, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to create dummy.', {
        cause: await response.text(),
      });
    }
    success = true;
  } catch (error: any) {
    console.log(error);
    success = false;
    loadErrorMessage = `Failed create dummy. Cause: ${error.message}`;
  }

  return {
    success,
    loadErrorMessage,
  };
}

const TABLE_HEAD: TableHeadings = [
  {
    heading: 'Dummy Name',
    rows: [
      {
        jsonPathExpression: '$.name',
      },
    ],
  },
];

const CREATE_FIELDS: FieldsConfig = [
  {
    name: 'name',
    label: 'Name',
    defaultValue: '',
    required: true,
  },
];

export function DummiesList() {
  const { dummies, loadErrorMessage } = useLoaderData() as DummiesLoaderData;
  const actionData = useActionData() as DummiesActionData;
  const hasSucceeded = !!actionData?.success;

  const [dummiesToDisplay, setDummiesToDisplay] =
    useState<TableRowDatas>(dummies);

  const handleDummiesSearch = (searchTerm?: string) => {
    if (!searchTerm || searchTerm.length === 0) {
      setDummiesToDisplay(dummies);
      return;
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase();

    const filteredDummies = dummies.filter((c) => {
      if (c.name && c.name.toLowerCase().includes(lowercaseSearchTerm)) {
        return true;
      }

      return false;
    });

    setDummiesToDisplay(filteredDummies);
  };

  return (
    <div>
      <div className="mx-4 mt-4 ">
        <div className="flex items-center justify-between">
          <Typography variant="h2" className="mb-2 text-eu-heading">
            Dummies
          </Typography>
          <AddButtonModal entityName="Dummy" fields={CREATE_FIELDS} />
        </div>
        {loadErrorMessage ? (
          <div
            role="alert"
            className="mb-4 relative flex w-full p-3 text-sm text-white bg-red-600 rounded-md"
          >
            {loadErrorMessage}
          </div>
        ) : null}
        {hasSucceeded ? (
          <div
            role="alert"
            className="mb-4 relative flex w-full p-3 text-sm text-white bg-green-600 rounded-md"
          >
            Dummy created successfully.
          </div>
        ) : null}
      </div>
      <TableWithSearch
        tableHeadings={TABLE_HEAD}
        tableRowData={dummiesToDisplay}
        searchCallback={handleDummiesSearch}
      />
    </div>
  );
}
