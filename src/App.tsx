import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { DocPage } from '@/pages/DocPage';
import { PrintPage } from '@/pages/PrintPage';
import { ToolsHub } from '@/pages/ToolsHub';
import { ToolRunner } from '@/pages/ToolRunner';
import { CasesPage } from '@/pages/CasesPage';
import { NewCasePage } from '@/pages/NewCasePage';
import { CaseDetailPage } from '@/pages/CaseDetailPage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { WorksheetsHub } from '@/pages/WorksheetsHub';
import { FourSentencesWorksheet } from '@/pages/FourSentencesWorksheet';
import { LifeReviewWorksheet } from '@/pages/LifeReviewWorksheet';
import { GroupBereavedWorksheet } from '@/pages/GroupBereavedWorksheet';
import { GroupDeathAnxietyWorksheet } from '@/pages/GroupDeathAnxietyWorksheet';
import { SharePage } from '@/pages/SharePage';
import { LoginPage } from '@/pages/LoginPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/share" element={<SharePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs/:slug" element={<DocPage />} />

          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/tools/:assessmentId" element={<ToolRunner />} />

          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/new" element={<NewCasePage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />

          <Route path="/resources" element={<ResourcesPage />} />

          <Route path="/worksheets" element={<WorksheetsHub />} />
          <Route path="/worksheets/four-sentences" element={<FourSentencesWorksheet />} />
          <Route path="/worksheets/life-review" element={<LifeReviewWorksheet />} />
          <Route path="/worksheets/group-bereaved" element={<GroupBereavedWorksheet />} />
          <Route path="/worksheets/group-death-anxiety" element={<GroupDeathAnxietyWorksheet />} />

          <Route path="/print/:slug" element={<PrintPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}