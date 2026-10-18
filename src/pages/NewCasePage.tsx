import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCase, type RiskFlag } from '@/lib/cases';

export function NewCasePage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [code, setCode] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [caregivers, setCaregivers] = useState('');
  const [concerns, setConcerns] = useState('');
  const [goal, setGoal] = useState('');
  const [contact, setContact] = useState('');
  const [risk, setRisk] = useState<RiskFlag>('normal');
  const [remark, setRemark] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('请填写个案编号（如 P-2024-001）');
      return;
    }
    const c = createCase({
      code: code.trim(),
      gender: gender || '',
      age: age ? Number(age) : 0,
      diagnosis: diagnosis || '',
      caregivers: caregivers || '',
      risk,
      stage: '接案',
      startDate: today,
      goal: goal || '',
      contact: contact || '',
      concerns: concerns
        .split(/[,，、\s]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      remark: remark || '',
    });
    navigate(`/cases/${c.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <a href="/cases" className="hover:text-brand-600">个案管理</a>
        <span className="mx-2">/</span>
        <span>新建个案</span>
      </nav>

      <header className="mb-6 border-b border-gray-200 pb-6 dark:border-brand-800">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">建立个案档案</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          数据仅保存在您的浏览器本地。请使用个案编号代替真实姓名以保护隐私。
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
        <Field label="个案编号 *" required>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="如 P-2024-001"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="性别">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
            >
              <option value="">未填</option>
              <option>男</option>
              <option>女</option>
              <option>其他</option>
            </select>
          </Field>
          <Field label="年龄">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="如 68"
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
            />
          </Field>
          <Field label="风险等级">
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value as RiskFlag)}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
            >
              <option value="normal">一般</option>
              <option value="watch">关注</option>
              <option value="high">高危</option>
            </select>
          </Field>
        </div>

        <Field label="主要诊断">
          <input
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="如 晚期肺癌（多发转移）"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>

        <Field label="家属与照顾者情况">
          <input
            value={caregivers}
            onChange={(e) => setCaregivers(e.target.value)}
            placeholder="如 妻子（主要照顾者），女儿（每周探望）"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>

        <Field label="关键议题（用逗号分隔）">
          <input
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            placeholder="如 疼痛控制, 死亡焦虑, 妻子照护负担"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>

        <Field label="服务目标">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={2}
            placeholder="如 缓解死亡焦虑，提升患者与家属临终生命质量"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>

        <Field label="联系方式（备案）">
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="如 妻子电话已备案"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>

        <Field label="备注">
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-brand-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900"
          >
            取消
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-brand-700"
          >
            建立档案
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}