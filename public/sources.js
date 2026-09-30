// Each source becomes a Google search: `site:<site> <query>`.
// To add a source, append { name, site } to the matching group.
window.SOURCE_GROUPS = [
    {
        title: 'Jobs & company profiles',
        sources: [
            { name: 'DOU', site: 'dou.ua' },
            { name: 'LinkedIn', site: 'linkedin.com' },
            { name: 'Djinni', site: 'djinni.co' },
            { name: 'Work.ua', site: 'work.ua' },
            { name: 'Wellfound', site: 'wellfound.com' },
        ],
    },
    {
        title: 'Legal & registries',
        sources: [
            { name: 'Opendatabot', site: 'opendatabot.ua' },
            { name: 'YouControl', site: 'youcontrol.com.ua' },
            { name: 'e-Äriregister', site: 'ariregister.rik.ee' },
            { name: 'GOV.UK Companies House', site: 'find-and-update.company-information.service.gov.uk' },
            { name: 'OpenCorporates', site: 'opencorporates.com' },
            { name: 'SEC EDGAR', site: 'sec.gov' },
            { name: 'Торговельна марка', site: 'iprop-ua.com' },
        ],
    },
    {
        title: 'Employee reviews & salaries',
        sources: [
            { name: 'Glassdoor', site: 'glassdoor.com' },
            { name: 'Indeed', site: 'indeed.com' },
            { name: 'Blind', site: 'teamblind.com' },
            { name: 'Levels.fyi', site: 'levels.fyi' },
            { name: 'Kununu', site: 'kununu.com' },
            { name: 'Welcome to the Jungle', site: 'app.welcometothejungle.com' },
        ],
    },
    {
        title: 'Clients & B2B reviews',
        sources: [
            { name: 'Clutch', site: 'clutch.co' },
            { name: 'Upwork', site: 'upwork.com' },
            { name: 'GoodFirms', site: 'goodfirms.co' },
        ],
    },
    {
        title: 'Startup & funding',
        sources: [
            { name: 'Crunchbase', site: 'crunchbase.com' },
            { name: 'Dealroom', site: 'app.dealroom.co' },
            { name: 'PitchBook', site: 'pitchbook.com' },
            { name: 'Y Combinator', site: 'ycombinator.com' },
        ],
    },
    {
        title: 'Engineering',
        sources: [
            { name: 'GitHub', site: 'github.com' },
            { name: 'GitLab', site: 'gitlab.com' },
            { name: 'Hacker News', site: 'news.ycombinator.com' },
        ],
    },
    {
        title: 'Social',
        sources: [
            { name: 'Reddit', site: 'reddit.com' },
            { name: 'Facebook', site: 'facebook.com' },
            { name: 'Instagram', site: 'instagram.com' },
        ],
    },
];
