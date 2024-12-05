import { Card, CardHeader, Input, Typography } from '@material-tailwind/react';
import {
  ClipboardIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import React, { ReactNode } from 'react';
import { JSONPath } from 'jsonpath-plus';

export interface TableHeading {
  heading?: string;
  icon?: ReactNode;
  copyToClipboard?: boolean;
  rows?: {
    prefix?: string;
    jsonPathExpression?: string;
    suffix?: string;
  }[];
}

export type TableHeadings = TableHeading[];

export interface TableRowData {
  id: string;
  [field: string]: any;
}

export type TableRowDatas = TableRowData[];

export function TableWithSearch({
  tableHeadings,
  tableRowData,
  searchCallback,
}: {
  tableHeadings: TableHeadings;
  tableRowData: TableRowDatas;
  searchCallback: (searchTerm: string) => void;
}) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchCallback(e.target.value);
  };
  return (
    <Card className="h-full w-full overflow-scroll">
      <CardHeader
        floated={false}
        shadow={false}
        className="mb-2 rounded-none p-2"
      >
        <div className="w-full md:w-96">
          <Input
            label="Search"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            crossOrigin={undefined}
            onChange={handleSearchChange}
          />
        </div>
      </CardHeader>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHeadings.map(({ heading, icon }) => {
              return (
                <th key={heading} className="border-b border-gray-300 p-2 pl-3">
                  <div className="flex items-center gap-1">
                    {icon}
                    <Typography className="!font-bold text-eu-body">
                      {heading}
                    </Typography>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tableRowData.map((rowData, dataIndex) => {
            const isLastRow = dataIndex === tableRowData.length - 1;
            const classes = isLastRow
              ? 'p-1 pl-3'
              : 'p-1 pl-3 border-b border-gray-300';

            const tableRow = tableHeadings.map((tableHeading) => {
              const cellContent: ReactNode[] = [];

              if (tableHeading.rows?.length) {
                cellContent.push(
                  tableHeading.rows.map((row, subRowIndex) => {
                    let value: string | undefined = undefined;

                    if (row.jsonPathExpression) {
                      value = JSONPath({
                        path: row.jsonPathExpression,
                        json: rowData,
                      }).join(', ');
                    }

                    const concatValue = `${row.prefix ?? ''}${value ?? ''}${row.suffix ?? ''}`;

                    return (
                      <Typography
                        variant="small"
                        className="font-normal text-eu-body flex"
                        key={`${tableHeading.heading}_${subRowIndex}`}
                      >
                        {concatValue}
                        {tableHeading.copyToClipboard ? (
                          <ClipboardIcon
                            className="size-3 ml-1 self-center"
                            onClick={() => {
                              navigator.clipboard.writeText(concatValue);
                            }}
                          />
                        ) : null}
                      </Typography>
                    );
                  }),
                );
              }

              return (
                <td className={classes} key={tableHeading.heading}>
                  <div className="items-center gap-1">
                    {cellContent.reduce(
                      (acc, cell) =>
                        // eslint-disable-next-line react/jsx-key
                        acc === null ? [cell] : [acc, <br />, cell],
                      null,
                    )}
                  </div>
                </td>
              );
            });

            return <tr key={rowData.id}>{tableRow}</tr>;
          })}
        </tbody>
      </table>
    </Card>
  );
}
