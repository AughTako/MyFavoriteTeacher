import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ClassRequest } from '../models/class_requests';
import { Request } from '../models/request';
import { User } from '../models/user';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  requests: Request[] = [];
  chartDataMFT = {};
  chartDataMFS = {};
  chartDataSubjects = {};
  chartDataDOW = {};
  chartEngaged = {};
  novPredmet: String = '';
  allTeachers: User[] = [];
  allStudents: User[] = [];
  allClasses: ClassRequest[] = [];
  constructor(private service: UnifiedService, private sanitizer: DomSanitizer) { }

  message: String = '';
  chartData: any;
  ngOnInit(): void {
    this.getRequests();
    this.message = '';
    this.service.getAllStudents().subscribe((students: User[]) => {
      if (students) {
        this.allStudents = students;
        const maleStudents = [...this.allStudents].filter(student => student.personalInfo.gender === 'M').length
        const femaleStudents = [...this.allStudents].filter(student => student.personalInfo.gender === 'Z').length
        this.chartDataMFS = {
          animationEnabled: true,
          title: {
            text: "Ucenici po polu"
          },
          data: [{
            type: "pie",
            startAngle: -90,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###.##'%'",
            dataPoints: [
              { y: maleStudents, name: "Muskarci" },
              { y: femaleStudents, name: "Zene" },
            ]
          }]
        }


      }
    })
    this.service.getAllTeachers().subscribe((teachers: User[]) => {
      if (teachers) {
        if (teachers) {
          this.allTeachers = teachers;
          // console.log(teachers)
          const maleTeachers = [...this.allTeachers].filter(teacher => teacher.personalInfo.gender === 'M').length
          const femaleTeachers = [...this.allTeachers].filter(teacher => teacher.personalInfo.gender === 'Z').length

          // console.log(maleTeachers)
          // console.log(femaleTeachers)
          this.chartDataMFT = {
            animationEnabled: true,
            title: {
              text: "Nastavnici po polu"
            },
            data: [{
              type: "pie",
              startAngle: -90,
              indexLabel: "{name}: {y}",
              yValueFormatString: "#,###.##'%'",
              dataPoints: [
                { y: maleTeachers, name: "Muskarci" },
                { y: femaleTeachers, name: "Zene" },
              ]
            }]
          }

          const allSubjects = this.allTeachers.flatMap(teacher => teacher.schoolInfo.subjects);
          const allAgeGroups = this.allTeachers.flatMap(teacher => teacher.schoolInfo.ageGroups)

          console.log(allSubjects)

          const subjectCountMap = new Map<string, number>();
          const ageGroupCountMap = new Map<string, number>();

          allSubjects.forEach((subject) => {
            const count = subjectCountMap.get(subject as string) || 0;
            subjectCountMap.set(subject as string, count + 1);
          });

          allAgeGroups.forEach((ageGroup) => {
            const count = subjectCountMap.get(ageGroup as string) || 0;
            ageGroupCountMap.set(ageGroup as string, count + 1);
          });

          const ageGroupCountArray = Array.from(ageGroupCountMap.entries()).map(([ageGroup, count]) => ({
            ageGroup,
            count
          }));
          const subjectCountArray = Array.from(subjectCountMap.entries()).map(([subject, count]) => ({
            subject,
            count
          }));
          // const mergedDataArray = [...subjectCountArray, ...ageGroupCountArray];
          // console.log(subjectCountArray)

          this.chartDataSubjects = {
            animationEnabled: true,
            title: {
              text: 'Starosne grupe i predmeti'
            },
            axisY2: {
              title: 'Starosne grupe',
              includeZero: true
            },
            axisY: {
              title: 'Predmeti'
            },
            data: [{
              type: 'bar',
              showInLegend: true,
              legendText: 'Starosne grupe',
              dataPoints: ageGroupCountArray.map(item => ({
                y: item.count,
                label: item.ageGroup
              }))
            },
            {
              type: 'bar',
              showInLegend: true,
              legendText: 'Predmeti',
              dataPoints: subjectCountArray.map(item => ({
                y: item.count,
                label: item.subject
              }))
            }
            ]
          };

          // console.log(this.chartDataSubjects)
        }
      }
    })

    this.service.getAllClasses().subscribe((classes: ClassRequest[]) => {
      if (classes) {
        this.allClasses = classes;
        const dayOfWeekStats = new Map<number, { count: number; sum: number }>();
        this.allClasses.forEach(classEntry => {
          const dateStart = new Date(classEntry.classInfo.dateStart);
          const dayOfWeek = dateStart.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

          const stats = dayOfWeekStats.get(dayOfWeek) || { count: 0, sum: 0 };
          stats.count += 1;
          stats.sum += 1; // Assuming each entry represents one class

          dayOfWeekStats.set(dayOfWeek, stats);
        });

        const averageClassesPerDayOfWeek = Array.from(dayOfWeekStats.entries()).map(([dayOfWeek, stats]) => ({
          dayOfWeek,
          average: stats.sum / stats.count,
        }));

        const dayOfWeekNames = ['NED', 'PON', 'UTO', 'SRE', 'CET', 'PET', 'SUB'];

        this.chartDataDOW = {
          title: { text: 'Casovi u nedelji' },
          animationEnabled: true,
          axisY: {
            includeZero: true
          },
          data: [{
            type: 'bar',
            indexLabel: "{y}",
            dataPoints: averageClassesPerDayOfWeek.map(entry => ({
              label: dayOfWeekNames[entry.dayOfWeek],
              y: entry.average
            }))
          }]
        }

        const teachersStats = new Map<string, { totalClasses: number; monthlyStats: Map<string, number> }>();
        this.allClasses.forEach(classEntry => {
          const teacherKey = classEntry.username; // Assuming 'username' is a unique identifier for teachers
          const dateStart = new Date(classEntry.classInfo.dateStart);
          const monthYearKey = `${dateStart.getMonth() + 1}-${dateStart.getFullYear()}`;
          console.log(monthYearKey)

          const teacherStats = teachersStats.get(teacherKey as string) || { totalClasses: 0, monthlyStats: new Map<string, number>() };
          teacherStats.totalClasses += 1; // Assuming each entry represents one class

          const monthlyCount = teacherStats.monthlyStats.get(monthYearKey) || 0;
          teacherStats.monthlyStats.set(monthYearKey, monthlyCount + 1);

          teachersStats.set(teacherKey as string, teacherStats);
        })

        // console.log(teachersStats)

        const top10Teachers = Array.from(teachersStats.entries())
          .sort(([, a], [, b]) => b.totalClasses - a.totalClasses)
          .slice(0, 10);
        // console.log(top10Teachers)
        this.chartEngaged = {
          title: { text: 'Top 10 nastavnika' },
          animationEnabled: true,
          axisY: {
            includeZero: true
          },
          data: [
            {
              type: 'line',
              indexLabel: "{teacherKey}",
              dataPoints: top10Teachers.flatMap(([teacherKey, teacherStats]) => {
                const teacherMonthlyStats = Array.from(teacherStats.monthlyStats.entries()).map(([monthYearKey, monthlyCount]) => {
                  const [month, year] = monthYearKey.split('-');
                  const date = new Date(`${year}-${month}`);

                  console.log(teacherKey)
                  console.log(monthlyCount)
                  console.log(date)
        
                  return {
                    x: date,
                    y: monthlyCount,
                    name: teacherKey
                  };
                });
                return teacherMonthlyStats;
              }).flat()
            }
          ]
        };

        console.log(this.chartEngaged)
      }
    })
  }

  getRequests() {

    this.service.getRequests().subscribe((requests_: Request[]) => {
      if (requests_) {
        this.requests = requests_;
      }
    });
  }

  openPDF(pdfPath: String) {
    console.log(pdfPath);
    const pdfUrl = this.service.getPDFUrl(pdfPath.toString().replace('uploads\\pdfs\\', ''));
    window.open(pdfUrl.toString(), '_blank');
  }

  acceptTeacher(username: String) {
    this.service.acceptTeacher(username).subscribe((msg: any) => {
      if (msg) {
        this.message = msg.message;
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
  }

  declineTeacher(username: String) {
    this.service.declineTeacher(username).subscribe((msg: any) => {
      if (msg) {
        this.message = msg.message;
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
  }

  addSubject() {
    this.service.addSubject(this.novPredmet)
    .subscribe((ok) => {
      console.log(ok);
    })
  }
}
