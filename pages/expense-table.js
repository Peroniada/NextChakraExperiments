import React from "react";
import {Flex} from "@chakra-ui/react"
import {DataTable} from "./data-table";

function initialData() {
  return [
    {
      date: "20.02.2021",
      name: "chicken",
      category: "food",
      price: 12,
      notes: "Lorem Slorem",
    },
    {
      date: "23.02.2021",
      name: "bread",
      category: "food",
      price: 12,
      notes: "Lorem Slorem",
    },
    {
      date: "24.02.2021",
      name: "vitamins",
      category: "health",
      price: 40,
      notes: "Lorem Slorem",
    },
    {
      date: "24.02.2021",
      name: "therapy",
      category: "health",
      price: 150,
      notes: "Lorem Slorem",
    },
    {
      date: "25.02.2021",
      name: "taxi",
      category: "transport",
      price: 24,
      notes: "Lorem Slorem",
    },
    {
      date: "26.02.2021",
      name: "whisky",
      category: "alcohol",
      price: 120,
      notes: "Lorem Slorem",
    },
    {
      date: "27.02.2021",
      name: "rum",
      category: "alcohol",
      price: 60,
      notes: "Lorem Slorem",
    },
    {
      date: "28.02.2021",
      name: "chicken",
      category: "food",
      price: 12,
      notes: "Lorem Slorem",
    },
  ];
}

export default function ExpenseTable() {
  const [data, setData] = React.useState(() => initialData())
  const [skipPageReset, setSkipPageReset] = React.useState(false)

  const columns = React.useMemo(
      () => [
        {
          Header: "Date",
          accessor: "date",
        },
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Category",
          accessor: "category",
        },
        {
          Header: "Price",
          accessor: "price",
          isNumeric: true,
        },
        {
          Header: "Notes",
          accessor: "notes"
        }

      ],
      [],
  )

  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: value,
            }
          }
          return row
        })
    )
  }

  const setReadOnly = (rowIndex, isReadOnly) => {

  }

  return (
      <Flex
          justifyContent={"center"}
      >
        <DataTable
            columns={columns}
            data={data}
            updateMyData={updateMyData}
            skipPageReset={skipPageReset}
        />
      </Flex>
  )

}