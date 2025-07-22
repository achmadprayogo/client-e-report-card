import ContentContainer from '../ContentContainer';
import ToolbarContainer from '../Toolbar/ToolbarContainer';
import ToolbarItem from '../Toolbar/ToolbarItem';
import Search from '../Toolbar/Search';
import TableContainer from '../Table/TableContainer';
import TableHeader from '../Table/TableHeader';
import TableData from '../Table/TableData';
import TablePagination from './Pagination';
import { useEffect, useState } from 'react';
import { getData } from '../../../fetcher';
import { useParams } from 'react-router';
import { Response, Option } from '../../../index';
import Helper from '../../../Helper';
import OptionsInput from '../Form/OptionsInput';
import { initialResponse, initialOptions } from '../../../initialStates';
import pdfMake from 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
import { c } from 'vite/dist/node/moduleRunnerTransport.d-CXw_Ws6P';

function PageReportCards() {
  const academicYearSelected = useParams().academic_year_id || '';
  const [response, setResponse] = useState<Response>(initialResponse);
  const [reportCards, setReportCards] = useState<ReportCardTableData[]>([]);
  const [className, setClassName] = useState<string>('');
  const [gradeClass, setGradeClass] = useState<string>('');
  const [quarter, setQuarter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [gradeClassOptions, setGradeClassOptions] = useState<Option[]>(initialOptions);
  const [classNameOptions, setClassNameOptions] = useState<Option[]>(initialOptions);
  const [quarterOptions, setQuarterOptions] = useState<Option[]>(initialOptions);

  interface ReportCardTableData {
    id: string;
    academic_year: string;
    nis: string;
    fullname: string;
    class_member_id: string;
    grade_class: string;
    class_name_id: string;
    class_name: string;
    homeroom_teacher: string;
    quarter_academic_year_id: string;
    quarter_academic_year: string;
  }

  interface ReportCardData {
    id: string;
    academic_year: string;
    nis: string;
    fullname: string;
    class_member_id: string;
    grade_class: string;
    class_name_id: string;
    class_name: string;
    homeroom_teacher: string;
    quarter_academic_year_id: string;
    quarter_academic_year: string;
    academic_scores?: { subject_name: string; score: number }[];
    standart_academic_score?: number;
    teacher_note?: string;
    student_attendance?: {
      total_sicks: number;
      total_permissions: number;
      total_absences: number;
    };
    aggregate_academic_score: {
      total_score: number;
      average_score: number;
      total_students: number;
      rank: number;
    };
  }

  async function fetchReportCards() {
    const pageQuery = `page[number]=${1}&page[size]=${20}`;
    const searchQuery = `search=${search}`;
    const academicYearQuery = `filter[academic_year_id]=${academicYearSelected}`;
    const classNameQuery = `filter[class_name_id]=${className}`;
    const gradeClassQuery = `filter[grade_class_id]=${gradeClass}`;
    const quarterQuery = `filter[quarter_academic_year_id]=${quarter}`;
    const sortQuery = `sort[by]=${sortBy}&sort[order]=${sortOrder}`;
    const URL = `/api/admin/report-card-table-data?${pageQuery}&${searchQuery}&${academicYearQuery}&${quarterQuery}&${classNameQuery}&${gradeClassQuery}&${sortQuery}`;
    const response = await getData(URL);

    setResponse(response);
    const formatedData: ReportCardTableData[] = Helper.formatTableReportCard(
      response.data,
      response.included,
    );
    setReportCards(formatedData);
  }

  useEffect(() => {
    fetchReportCards();
  }, [search, academicYearSelected, gradeClass, className, quarter, sortBy, sortOrder]);

  useEffect(() => {
    async function fetchGradeOptions() {
      let result = await Helper.getGradeClassOptions(academicYearSelected);
      result = [...result, { label: 'Semua', value: '' }];
      const options = Helper.setIndexOptionSelected(result, result.length - 1, true);
      setGradeClassOptions(options);
    }
    async function fetchQuarterOptions() {
      const result = await Helper.getQuarterOptions(academicYearSelected);
      const options = Helper.setIndexOptionSelected(result, result.length - 1, true);
      setQuarterOptions(options);
    }
    if (academicYearSelected !== '') {
      fetchGradeOptions();
      fetchQuarterOptions();
    }
  }, [academicYearSelected]);

  const handleSearch = (search: string) => {
    setSearch(search);
  };

  const handleGradeClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGradeClass(e.target.value);
    async function fetchOptions() {
      const result = await Helper.getClassNameOptions(e.target.value);
      const options = Helper.setIndexOptionSelected(result, result.length - 1, true);
      setClassNameOptions(options);
    }
    if (e.target.value !== '') {
      fetchOptions();
    }
  };

  const handleClassNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassName(e.target.value);
  };

  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuarter(e.target.value);
  };

  const hadleDownloadPDF = async (classMemberId: string, quarterAcademicYearId: string) => {
    const classNameQuery = `class_name_id=${className}`;
    const classMemberQuery = `class_member_id=${classMemberId}`;
    const quarterQuery = `quarter_academic_year_id=${quarterAcademicYearId}`;
    const URL =
      '/api/admin/report-card?' + classMemberQuery + '&' + quarterQuery + '&' + classNameQuery;
    const response: Response = await getData(URL);

    const reportCardData: ReportCardData[] = Helper.formatReportCard(
      response.data,
      response.included,
    );

    const PDF = setFormatRaportCardPDF(reportCardData);
    pdfMake.createPdf(PDF).open(); //download('e-rapor.pdf');
  };

  const setFormatRaportCardPDF = (reportCardData: ReportCardData[]) => {
    const dateText = `Bululawang, ${new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`;

    const formatPDF = {
      pageSize: { width: 595, height: 935 }, // F4 size
      content: reportCardData.flatMap((data, index) => {
        return [
          ...(index > 0 ? [{ text: '', pageBreak: 'before' }] : []),
          {
            text: 'Teks di bawah kiri',
            absolutePosition: {
              x: 40, // jarak dari kiri
              y: 860, // jarak dari atas (semakin besar nilainya, semakin ke bawah)
            },
          },
          { text: 'E-RAPOR', style: 'header' },
          { text: 'Madradah Diniyah An-Nur II Al-Murtadlo', style: 'subheader' },
          {
            margin: [0, 0, 0, 12],
            layout: 'noBorders',
            table: {
              widths: [51, '*', 71, '*'],
              body: [
                [
                  { text: 'No. Induk' },
                  { text: `: ${data.nis}` },
                  { text: 'Tahun Ajaran' },
                  { text: `: ${data.academic_year}` },
                ],
                [
                  { text: 'Nama' },
                  { text: `: ${data.fullname}` },
                  { text: 'Cawu' },
                  { text: `: ${data.quarter_academic_year}` },
                ],
                [
                  { text: 'Kelas' },
                  { text: `: ${data.grade_class} ${data.class_name}` },
                  { text: 'Wali Kelas' },
                  { text: `: ${data.homeroom_teacher}` },
                ],
              ],
            },
          },
          // main table
          {
            layout: {
              hLineWidth: function (i: any, node: any) {
                return i === 0 || i === node.table.body.length ? 2 : 1;
              },
              vLineWidth: function (i: any, node: any) {
                return i === 0 || i === node.table.widths.length ? 2 : 1;
              },
            },
            table: {
              headerRows: 1,
              widths: [21, 'auto', 70, '*', '*'],

              body: [
                [
                  { text: 'No.', style: 'tableHeader' },
                  { text: 'Aspek Penilaian', style: 'tableHeader' },
                  { text: 'KKM', style: 'tableHeader' },
                  { text: 'Nilai Ujian', style: 'tableHeader' },
                  { text: 'Keterangan', style: 'tableHeader' },
                ],
                [
                  {
                    rowSpan: (data.academic_scores ?? []).length + 1,
                    text: 'A',
                    bold: true,
                  },
                  { colSpan: 4, text: 'Mata Pelajaran', bold: true },
                ],
                ...(data.academic_scores ?? []).map((item) => [
                  '',
                  item.subject_name,
                  data.standart_academic_score,
                  item.score,
                  'Sempurna',
                ]),
                [
                  { rowSpan: 9, text: 'B', bold: true },
                  { colSpan: 4, text: 'Keseharian', bold: true },
                ],
                ['', 'Kejujuran', 60, 100, 'Sempurna'],
                ['', 'Tawadhu', 60, 100, 'Sempurna'],
                ['', 'Kesabaran', 60, 100, 'Sempurna'],
                ['', 'Kesosialan', 60, 100, 'Sempurna'],
                ['', 'Menjaga', 60, 100, 'Sempurna'],
                ['', 'Peribadahan', 60, 100, 'Sempurna'],
                ['', 'Ketaatan', 60, 100, 'Sempurna'],
                ['', 'Kebersihan', 60, 100, 'Sempurna'],
                [
                  { rowSpan: 5, text: 'C', bold: true },
                  { colSpan: 4, text: 'Akumulasi Nilai', bold: true },
                ],
                [
                  '',
                  { text: 'Total Nilai', colSpan: 2 },
                  '',
                  { text: data.aggregate_academic_score.total_score, colSpan: 2 },
                  '',
                ],
                [
                  '',
                  { text: 'Rata-rata Nilai', colSpan: 2 },
                  '',
                  { text: data.aggregate_academic_score.average_score, colSpan: 2 },
                  '',
                ],
                [
                  '',
                  { text: 'Peringkat', colSpan: 2 },
                  '',
                  {
                    text: `${data.aggregate_academic_score.rank} dari ${data.aggregate_academic_score.total_students} santri`,
                    colSpan: 2,
                  },
                  '',
                ],
                [
                  '',
                  { text: 'Naik Kelas', colSpan: 2 },
                  '',
                  'Ya',
                  { text: 'Tidak', decoration: 'lineThrough' },
                ],
                [
                  { rowSpan: 4, text: 'D', bold: true },
                  { colSpan: 4, text: 'Absensi', bold: true },
                ],
                [
                  '',
                  { text: 'Sakit', colSpan: 2 },
                  '',
                  data.student_attendance?.total_sicks,
                  'Jam',
                ],
                [
                  '',
                  { text: 'Izin', colSpan: 2 },
                  '',
                  data.student_attendance?.total_permissions,
                  'Jam',
                ],
                [
                  '',
                  { text: 'Tanpa Keterangan', colSpan: 2 },
                  '',
                  data.student_attendance?.total_absences,
                  'Jam',
                ],
                [
                  { rowSpan: 2, text: 'E' },
                  {
                    colSpan: 4,
                    text: 'Catatan:',
                    bold: true,
                    border: [false, false, true, false],
                  },
                ],
                [
                  '',
                  {
                    text: `"${data.teacher_note || 'Tidak ada catatan'}"`,
                    alignment: 'center',
                    italics: true,
                    colSpan: 4,
                    border: [false, false, true, true],
                  },
                  '',
                  '',
                  '',
                ],
              ],
            },
          },
          {
            margin: [0, 5, 0, 0],
            unbreakable: true,
            stack: [
              // Date and place information
              {
                text: `${dateText}`,
                alignment: 'right',
                margin: [0, 0, 0, 0],
              },
              // Signature table
              {
                table: {
                  widths: ['*', '*', '*'],
                  body: [
                    [
                      {
                        text: 'Orang Tua/Wali Santri',
                        alignment: 'center',
                        border: [false, false, false, false],
                      },
                      {
                        text: 'Wali Kelas',
                        alignment: 'center',
                        border: [false, false, false, false],
                      },
                      {
                        text: 'Kepala Madrasah',
                        alignment: 'center',
                        border: [false, false, false, false],
                      },
                    ],
                    [
                      {
                        text: '',
                        border: [false, false, false, true],
                      },
                      {
                        text: `${data.homeroom_teacher}`,
                        alignment: 'center',
                        margin: [0, 70, 0, 0],
                        border: [false, false, false, false],
                      },
                      {
                        text: 'Ust. Zainul Arifin, S. Pd',
                        alignment: 'center',
                        margin: [0, 70, 0, 0],
                        border: [false, false, false, false],
                      },
                    ],
                  ],
                },
              },
            ],
          },
        ];
      }),
      footer: function (currentPage: number, numberOfPages: number) {
        return {
          columns: [
            // Left side - your existing footer
            {
              text: `MADIN_AN2_`,
              fontSize: 10,
              margin: [40, 20, 0, 0],
            },
            // Right side - page numbers
            // {
            //   text: `${currentPage}/${numberOfPages}`,
            //   alignment: 'right',
            //   margin: [0, 20, 40, 0],
            // },
          ],
        };
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 0],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        tableExample: {
          margin: [0, 5, 0, 0],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
    };

    return formatPDF;
  };

  const handleDownloadAllRaportCardPDF = async () => {
    const classNameQuery = `class_name_id=${className}`;
    const quarterQuery = `quarter_academic_year_id=${quarter}`;
    const URL = '/api/admin/report-card?' + classNameQuery + '&' + quarterQuery;
    const response: Response = await getData(URL);

    const reportCardData: ReportCardData[] = Helper.formatReportCard(
      response.data,
      response.included,
    );
    console.log(response);
    console.log(reportCardData);
    const PDF = setFormatRaportCardPDF(reportCardData);
    pdfMake.createPdf(PDF).open(); //download('e-rapor.pdf');
  };

  const handlePagingation = async (url: string) => {
    const result = await getData(url);

    if (result) {
      setResponse(result);
      const data: ReportCardData[] = Helper.formatTableReportCard(
        result.data,
        result.included,
      ) as ReportCardData[];
      setReportCards(data);
    }
  };

  return (
    <ContentContainer direction="column">
      <ToolbarContainer>
        <ToolbarItem icon="description">{`${response.meta.page.total} File Rapor`}</ToolbarItem>
        <Search onSearch={handleSearch} />
        {academicYearSelected && (
          <>
            <ToolbarItem icon="stacks">
              <div>
                <select
                  onChange={handleGradeClassChange}
                  name="grade_class_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={gradeClassOptions} />
                </select>
              </div>
            </ToolbarItem>
            <ToolbarItem icon="meeting_room">
              <div className="flex flex-row space-x-2">
                <select
                  onChange={handleClassNameChange}
                  name="class_name_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={classNameOptions} />
                </select>
              </div>
            </ToolbarItem>
            <ToolbarItem icon="search_activity">
              <div className="flex flex-row space-x-2">
                <select
                  onChange={handleQuarterChange}
                  name="class_name_id"
                  className="text-white bg-transparent focus:outline-none"
                >
                  <OptionsInput options={quarterOptions} />
                </select>
              </div>
            </ToolbarItem>
            {className && quarter && (
              <>
                <ToolbarItem icon="file_download" onClick={() => {}}>
                  Identitas
                </ToolbarItem>
                <ToolbarItem icon="file_download" onClick={() => handleDownloadAllRaportCardPDF()}>
                  Rapor
                </ToolbarItem>
              </>
            )}
          </>
        )}
      </ToolbarContainer>
      <TableContainer>
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 bg-[#343a40]">
            <tr>
              <TableHeader>No</TableHeader>
              <TableHeader>Tahun Ajaran</TableHeader>
              <TableHeader>NIS</TableHeader>
              <TableHeader>Nama</TableHeader>
              <TableHeader>Tingkat</TableHeader>
              <TableHeader>Kelas</TableHeader>
              <TableHeader>Wali Kelas</TableHeader>
              <TableHeader>Cawu</TableHeader>
              <TableHeader>Files</TableHeader>
            </tr>
          </thead>
          <tbody>
            {reportCards.map((data, index) => (
              <tr key={data.id} id={data.id} className="hover:bg-[#071f10]">
                <TableData>{index + response.meta.page.from}</TableData>
                <TableData>{data.academic_year}</TableData>
                <TableData>{data.nis}</TableData>
                <TableData>{data.fullname}</TableData>
                <TableData>{data.grade_class}</TableData>
                <TableData>{data.class_name}</TableData>
                <TableData>{'Ust. ' + data.homeroom_teacher}</TableData>
                <TableData>{data.quarter_academic_year}</TableData>
                <TableData wrapText={true}>
                  <div className="flex flex-row space-x-3">
                    <button className="w-28 flex items-center justify-center px-2 rounded-lg bg-blue-700 text-base">
                      <span className="material-symbols-outlined me-1 text-base">download_2</span>{' '}
                      Identitas
                    </button>
                    <button
                      className="w-28 flex items-center justify-center px-2 rounded-lg bg-green-700 text-base"
                      onClick={() =>
                        hadleDownloadPDF(data.class_member_id, data.quarter_academic_year_id)
                      }
                    >
                      <span className="material-symbols-outlined me-1 text-base">download_2</span>{' '}
                      Rapor
                    </button>
                  </div>
                </TableData>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
      <TablePagination
        currentPage={response.meta.page.current_page}
        totalPages={response.meta.page.last_page}
        onPageNext={() => handlePagingation(response.links.next)}
        onPagePrev={() => handlePagingation(response.links.prev)}
      />
    </ContentContainer>
  );
}

export default PageReportCards;
