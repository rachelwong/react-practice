import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAlbums } from "@/context/AlbumsContext";
import { StepBack, StepForward } from "lucide-react";

const TablePagination = () => {
  const { headers, currPageData, totalNumPages, goToPage, currIndex } =
    useAlbums();

  return (
    <Layout
      title="Table Pagination"
      brief="https://www.reactchallenges.com/challenges/simple-pagination"
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col justify-start items-center gap-y-5">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currPageData.map((row) => (
              <TableRow key={JSON.stringify(row)}>
                {Object.values(row).map((rowData, rowDataIndex) => (
                  <TableCell key={`${rowData}-${rowDataIndex}`}>
                    {rowData}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-row items-center justify-center gap-x-4">
          <Button disabled={currIndex === 0} onClick={() => {}}>
            <StepBack />
          </Button>
          <Button disabled={currIndex === 0} onClick={() => {}}>
            Prev
          </Button>
          <div className="flex flex-row items-center justify-center gap-x-2">
            {Array.from(Array(totalNumPages).keys()).map((x) => {
              return (
                <Button
                  disabled={currIndex === x}
                  key={x}
                  onClick={() => {
                    goToPage(x);
                  }}
                >
                  {x + 1}
                </Button>
              );
            })}
          </div>
          <Button disabled={currIndex + 1 === totalNumPages} onClick={() => {}}>
            Next
          </Button>
          <Button disabled={currIndex + 1 === totalNumPages} onClick={() => {}}>
            <StepForward />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default TablePagination;
