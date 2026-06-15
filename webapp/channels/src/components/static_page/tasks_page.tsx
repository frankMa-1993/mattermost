// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useMemo, useRef, useState} from 'react';
import type {ChangeEvent, ReactNode} from 'react';
import {useDispatch} from 'react-redux';

import {Button} from '@mattermost/shared/components/button';
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyIcon,
    SettingsOutlineIcon,
} from '@mattermost/compass-icons/components';

import {selectLhsItem} from 'actions/views/lhs';
import {suppressRHS, unsuppressRHS} from 'actions/views/rhs';

import {LhsItemType, LhsPage} from 'types/store/lhs';

import './tasks_page.scss';

type TaskStatus = 'pending_receipt' | 'pending_confirm' | 'pending_assign' | 'in_progress' | 'overdue' | 'exception';
type TaskRisk = 'high' | 'medium' | 'low';
type TaskDepartment = '产品中心' | '法务部' | '运营中心' | '技术中心' | '市场部';
type TaskOwner = '张三' | '陈晨' | '李娜' | '王敏' | '赵磊';
type TaskSource = '会议纪要' | '消息' | '邮件' | '系统派发';
type SummaryFilterKey = TaskStatus | 'high_risk';
type VisibleColumnKey = 'status' | 'owner' | 'department' | 'dueAt' | 'risk' | 'progress' | 'agent';

type TaskRecord = {
    id: string;
    title: string;
    status: TaskStatus;
    owner: TaskOwner;
    department: TaskDepartment;
    dueAt: string;
    risk: TaskRisk;
    progress: number;
    progressColor: string;
    source: TaskSource;
    agentLabel?: string;
};

type TaskFilterState = {
    keyword: string;
    statuses: TaskStatus[];
    risks: TaskRisk[];
    departments: TaskDepartment[];
    owners: TaskOwner[];
    sources: TaskSource[];
};

type FilterOption<T extends string> = {
    value: T;
    label: string;
};

type StatCard = {
    key: SummaryFilterKey;
    label: string;
    dotColor: string;
    value: number;
};

const DEFAULT_FILTERS: TaskFilterState = {
    keyword: '',
    statuses: [],
    risks: [],
    departments: [],
    owners: [],
    sources: [],
};

const DEFAULT_VISIBLE_COLUMNS: Record<VisibleColumnKey, boolean> = {
    status: true,
    owner: true,
    department: true,
    dueAt: true,
    risk: true,
    progress: true,
    agent: true,
};

const STATUS_META: Record<TaskStatus, {label: string; dotColor: string}> = {
    pending_receipt: {label: '待接收', dotColor: '#20C7BD'},
    pending_confirm: {label: '待确认', dotColor: '#F6B63F'},
    pending_assign: {label: '待分配', dotColor: '#8F5BFF'},
    in_progress: {label: '进行中', dotColor: '#2F80FF'},
    overdue: {label: '已逾期', dotColor: '#FF5F59'},
    exception: {label: '异常中', dotColor: '#FF7A45'},
};

const RISK_META: Record<TaskRisk, {label: string; textColor: string; backgroundColor: string; borderColor: string}> = {
    high: {label: '高', textColor: '#FF5F59', backgroundColor: '#FFF1F0', borderColor: '#FFCCC7'},
    medium: {label: '中', textColor: '#D48806', backgroundColor: '#FFF7E6', borderColor: '#FFD591'},
    low: {label: '低', textColor: '#389E0D', backgroundColor: '#F6FFED', borderColor: '#B7EB8F'},
};

const STATUS_OPTIONS: Array<FilterOption<TaskStatus>> = [
    {value: 'pending_receipt', label: '待接收'},
    {value: 'pending_confirm', label: '待确认'},
    {value: 'pending_assign', label: '待分配'},
    {value: 'in_progress', label: '进行中'},
    {value: 'overdue', label: '已逾期'},
    {value: 'exception', label: '异常中'},
];

const RISK_OPTIONS: Array<FilterOption<TaskRisk>> = [
    {value: 'high', label: '高'},
    {value: 'medium', label: '中'},
    {value: 'low', label: '低'},
];

const DEPARTMENT_OPTIONS: Array<FilterOption<TaskDepartment>> = [
    {value: '产品中心', label: '产品中心'},
    {value: '法务部', label: '法务部'},
    {value: '运营中心', label: '运营中心'},
    {value: '技术中心', label: '技术中心'},
    {value: '市场部', label: '市场部'},
];

const OWNER_OPTIONS: Array<FilterOption<TaskOwner>> = [
    {value: '张三', label: '张三'},
    {value: '陈晨', label: '陈晨'},
    {value: '李娜', label: '李娜'},
    {value: '王敏', label: '王敏'},
    {value: '赵磊', label: '赵磊'},
];

const SOURCE_OPTIONS: Array<FilterOption<TaskSource>> = [
    {value: '会议纪要', label: '会议纪要'},
    {value: '消息', label: '消息'},
    {value: '邮件', label: '邮件'},
    {value: '系统派发', label: '系统派发'},
];

const COLUMN_OPTIONS: Array<{key: VisibleColumnKey; label: string}> = [
    {key: 'status', label: '状态'},
    {key: 'owner', label: '责任人'},
    {key: 'department', label: '部门'},
    {key: 'dueAt', label: '截止'},
    {key: 'risk', label: '风险'},
    {key: 'progress', label: '进度'},
    {key: 'agent', label: 'Agent'},
];

const MOCK_TASKS: TaskRecord[] = [
    {
        id: 'task-001',
        title: '产品上线验收报告闭环',
        status: 'overdue',
        owner: '张三',
        department: '产品中心',
        dueAt: '今天 18:00',
        risk: 'high',
        progress: 78,
        progressColor: '#F35B5B',
        source: '会议纪要',
        agentLabel: '智办',
    },
    {
        id: 'task-002',
        title: '合同附件补正',
        status: 'in_progress',
        owner: '陈晨',
        department: '法务部',
        dueAt: '06-18',
        risk: 'medium',
        progress: 63,
        progressColor: '#F6AF2F',
        source: '消息',
        agentLabel: '智办',
    },
    {
        id: 'task-003',
        title: '品牌活动物料终审',
        status: 'pending_confirm',
        owner: '李娜',
        department: '市场部',
        dueAt: '06-19',
        risk: 'low',
        progress: 40,
        progressColor: '#18C2B8',
        source: '邮件',
        agentLabel: '智办',
    },
    {
        id: 'task-004',
        title: '数据报表口径同步',
        status: 'pending_assign',
        owner: '王敏',
        department: '运营中心',
        dueAt: '06-20',
        risk: 'medium',
        progress: 28,
        progressColor: '#8F5BFF',
        source: '系统派发',
        agentLabel: '智办',
    },
    {
        id: 'task-005',
        title: '研发环境巡检与修复',
        status: 'exception',
        owner: '赵磊',
        department: '技术中心',
        dueAt: '06-16',
        risk: 'high',
        progress: 55,
        progressColor: '#FF7A45',
        source: '消息',
        agentLabel: '智办',
    },
    {
        id: 'task-006',
        title: '客户回访结论确认',
        status: 'pending_receipt',
        owner: '张三',
        department: '运营中心',
        dueAt: '06-22',
        risk: 'low',
        progress: 12,
        progressColor: '#2F80FF',
        source: '会议纪要',
        agentLabel: '智办',
    },
    {
        id: 'task-007',
        title: '知识库迁移排期推进',
        status: 'in_progress',
        owner: '陈晨',
        department: '产品中心',
        dueAt: '06-24',
        risk: 'medium',
        progress: 86,
        progressColor: '#4C6FFF',
        source: '系统派发',
        agentLabel: '智办',
    },
];

function includesIgnoreCase(target: string, keyword: string) {
    return target.toLowerCase().includes(keyword.trim().toLowerCase());
}

function buildRequestParams(globalKeyword: string, filters: TaskFilterState, summaryFilter: SummaryFilterKey | null) {
    return {
        globalKeyword,
        filters,
        summaryFilter,
    };
}

function useDismissableLayer(isOpen: boolean, onClose: () => void) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [isOpen, onClose]);

    return containerRef;
}

function FilterField({label, children}: {label: string; children: ReactNode}) {
    return (
        <div className='TasksPage__filterField'>
            <span className='TasksPage__filterLabel'>{label}</span>
            {children}
        </div>
    );
}

function MultiSelectDropdown<T extends string>({
    placeholder,
    options,
    values,
    onChange,
}: {
    placeholder: string;
    options: Array<FilterOption<T>>;
    values: T[];
    onChange: (nextValues: T[]) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useDismissableLayer(isOpen, () => setIsOpen(false));

    const selectedText = values.length > 0 ?
        options.filter((option) => values.includes(option.value)).map((option) => option.label).join('、') :
        placeholder;

    const handleToggleValue = (value: T) => {
        if (values.includes(value)) {
            onChange(values.filter((item) => item !== value));
            return;
        }

        onChange([...values, value]);
    };

    return (
        <div
            ref={dropdownRef}
            className='TasksPage__dropdown'
        >
            <button
                type='button'
                className='TasksPage__dropdownTrigger'
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span className={values.length > 0 ? 'TasksPage__dropdownValue' : 'TasksPage__dropdownPlaceholder'}>
                    {selectedText}
                </span>
                <ChevronDownIcon size={16}/>
            </button>
            {isOpen && (
                <div className='TasksPage__dropdownMenu'>
                    {options.map((option) => {
                        const checked = values.includes(option.value);

                        return (
                            <label
                                key={option.value}
                                className='TasksPage__dropdownOption'
                            >
                                <input
                                    type='checkbox'
                                    checked={checked}
                                    onChange={() => handleToggleValue(option.value)}
                                />
                                <span>{option.label}</span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ColumnSettings({
    visibleColumns,
    onChange,
}: {
    visibleColumns: Record<VisibleColumnKey, boolean>;
    onChange: (nextVisibleColumns: Record<VisibleColumnKey, boolean>) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const settingsRef = useDismissableLayer(isOpen, () => setIsOpen(false));

    const handleToggleColumn = (columnKey: VisibleColumnKey) => {
        onChange({
            ...visibleColumns,
            [columnKey]: !visibleColumns[columnKey],
        });
    };

    return (
        <div
            ref={settingsRef}
            className='TasksPage__columnSettings'
        >
            <button
                type='button'
                className='TasksPage__columnSettingsButton'
                aria-label='表格列设置'
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <SettingsOutlineIcon size={16}/>
            </button>
            {isOpen && (
                <div className='TasksPage__columnMenu'>
                    <div className='TasksPage__columnMenuTitle'>{'显示列'}</div>
                    {COLUMN_OPTIONS.map((column) => (
                        <label
                            key={column.key}
                            className='TasksPage__dropdownOption'
                        >
                            <input
                                type='checkbox'
                                checked={visibleColumns[column.key]}
                                onChange={() => handleToggleColumn(column.key)}
                            />
                            <span>{column.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

function TasksPage() {
    const dispatch = useDispatch();
    const selectAllRef = useRef<HTMLInputElement>(null);

    const [globalKeywordDraft, setGlobalKeywordDraft] = useState('');
    const [globalKeyword, setGlobalKeyword] = useState('');
    const [filterDraft, setFilterDraft] = useState<TaskFilterState>(DEFAULT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<TaskFilterState>(DEFAULT_FILTERS);
    const [activeSummaryFilter, setActiveSummaryFilter] = useState<SummaryFilterKey | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<Record<VisibleColumnKey, boolean>>(DEFAULT_VISIBLE_COLUMNS);

    useEffect(() => {
        dispatch(selectLhsItem(LhsItemType.Page, LhsPage.Tasks));
        dispatch(suppressRHS);

        return () => {
            dispatch(unsuppressRHS);
        };
    }, [dispatch]);

    const statCards = useMemo<StatCard[]>(() => {
        const countByStatus = (status: TaskStatus) => MOCK_TASKS.filter((task) => task.status === status).length;

        return [
            {key: 'pending_receipt', label: '待接收', dotColor: STATUS_META.pending_receipt.dotColor, value: countByStatus('pending_receipt')},
            {key: 'pending_confirm', label: '待确认', dotColor: STATUS_META.pending_confirm.dotColor, value: countByStatus('pending_confirm')},
            {key: 'pending_assign', label: '待分配', dotColor: STATUS_META.pending_assign.dotColor, value: countByStatus('pending_assign')},
            {key: 'in_progress', label: '进行中', dotColor: STATUS_META.in_progress.dotColor, value: countByStatus('in_progress')},
            {key: 'overdue', label: '已逾期', dotColor: STATUS_META.overdue.dotColor, value: countByStatus('overdue')},
            {key: 'exception', label: '异常中', dotColor: STATUS_META.exception.dotColor, value: countByStatus('exception')},
            {key: 'high_risk', label: '高风险', dotColor: '#FF5F59', value: MOCK_TASKS.filter((task) => task.risk === 'high').length},
        ];
    }, []);

    const filteredTasks = useMemo(() => {
        return MOCK_TASKS.filter((task) => {
            if (globalKeyword && ![task.title, task.owner, task.department, task.source].some((value) => includesIgnoreCase(value, globalKeyword))) {
                return false;
            }

            if (appliedFilters.keyword && !includesIgnoreCase(task.title, appliedFilters.keyword)) {
                return false;
            }

            if (appliedFilters.statuses.length > 0 && !appliedFilters.statuses.includes(task.status)) {
                return false;
            }

            if (appliedFilters.risks.length > 0 && !appliedFilters.risks.includes(task.risk)) {
                return false;
            }

            if (appliedFilters.departments.length > 0 && !appliedFilters.departments.includes(task.department)) {
                return false;
            }

            if (appliedFilters.owners.length > 0 && !appliedFilters.owners.includes(task.owner)) {
                return false;
            }

            if (appliedFilters.sources.length > 0 && !appliedFilters.sources.includes(task.source)) {
                return false;
            }

            if (activeSummaryFilter === 'high_risk' && task.risk !== 'high') {
                return false;
            }

            if (activeSummaryFilter && activeSummaryFilter !== 'high_risk' && task.status !== activeSummaryFilter) {
                return false;
            }

            return true;
        });
    }, [activeSummaryFilter, appliedFilters, globalKeyword]);

    const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));

    useEffect(() => {
        setCurrentPage((prev) => Math.min(prev, totalPages));
    }, [totalPages]);

    const pagedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredTasks.slice(startIndex, startIndex + pageSize);
    }, [currentPage, filteredTasks, pageSize]);

    useEffect(() => {
        const allChecked = pagedTasks.length > 0 && pagedTasks.every((task) => selectedIds.includes(task.id));
        const partiallyChecked = pagedTasks.some((task) => selectedIds.includes(task.id)) && !allChecked;

        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = partiallyChecked;
        }
    }, [pagedTasks, selectedIds]);

    const handleDraftFilterChange = <K extends keyof TaskFilterState>(key: K, value: TaskFilterState[K]) => {
        setFilterDraft((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleQuery = () => {
        buildRequestParams(globalKeywordDraft, filterDraft, activeSummaryFilter);
        setGlobalKeyword(globalKeywordDraft.trim());
        setAppliedFilters(filterDraft);
        setCurrentPage(1);
    };

    const handleReset = () => {
        setGlobalKeywordDraft('');
        setGlobalKeyword('');
        setFilterDraft(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
        setActiveSummaryFilter(null);
        setCurrentPage(1);
        setSelectedIds([]);
    };

    const handleExport = () => {
        buildRequestParams(globalKeyword, appliedFilters, activeSummaryFilter);
    };

    const handleToggleSummaryCard = (key: SummaryFilterKey) => {
        setActiveSummaryFilter((prev) => prev === key ? null : key);
        setCurrentPage(1);
    };

    const handleToggleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const nextIds = new Set(selectedIds);
            pagedTasks.forEach((task) => nextIds.add(task.id));
            setSelectedIds(Array.from(nextIds));
            return;
        }

        setSelectedIds(selectedIds.filter((id) => !pagedTasks.some((task) => task.id === id)));
    };

    const handleToggleRow = (taskId: string) => {
        setSelectedIds((prev) => prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]);
    };

    const headerColSpan = 2 + COLUMN_OPTIONS.filter((column) => visibleColumns[column.key]).length + 1;
    const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1);

    return (
        <div className='TasksPage app__content'>
            <div className='TasksPage__container'>
                <div className='TasksPage__toolbar'>
                    <div className='TasksPage__globalSearch'>
                        <MagnifyIcon size={18}/>
                        <input
                            value={globalKeywordDraft}
                            onChange={(event) => setGlobalKeywordDraft(event.target.value)}
                            placeholder='搜索消息、事项、联系人'
                        />
                    </div>
                    <button
                        type='button'
                        className='TasksPage__userShortcut'
                    >
                        <span className='TasksPage__avatar'>{'张'}</span>
                        <span className='TasksPage__userName'>{'张三'}</span>
                        <ChevronDownIcon size={14}/>
                    </button>
                </div>

                <div className='TasksPage__stats'>
                    {statCards.map((card) => {
                        const isActive = activeSummaryFilter === card.key;

                        return (
                            <button
                                key={card.key}
                                type='button'
                                className={`TasksPage__statCard${isActive ? ' TasksPage__statCard--active' : ''}`}
                                onClick={() => handleToggleSummaryCard(card.key)}
                            >
                                <div className='TasksPage__statLabel'>
                                    <span
                                        className='TasksPage__statDot'
                                        style={{backgroundColor: card.dotColor}}
                                    />
                                    <span>{card.label}</span>
                                </div>
                                <div className='TasksPage__statValue'>{card.value}</div>
                            </button>
                        );
                    })}
                </div>

                <div className='TasksPage__filters'>
                    <div className='TasksPage__filterGrid'>
                        <FilterField label='搜索'>
                            <div className='TasksPage__textInput'>
                                <input
                                    value={filterDraft.keyword}
                                    onChange={(event) => handleDraftFilterChange('keyword', event.target.value)}
                                    placeholder='请输入事项标题关键词'
                                />
                            </div>
                        </FilterField>

                        <FilterField label='状态'>
                            <MultiSelectDropdown
                                placeholder='请选择状态'
                                options={STATUS_OPTIONS}
                                values={filterDraft.statuses}
                                onChange={(value) => handleDraftFilterChange('statuses', value)}
                            />
                        </FilterField>

                        <FilterField label='风险'>
                            <MultiSelectDropdown
                                placeholder='请选择风险'
                                options={RISK_OPTIONS}
                                values={filterDraft.risks}
                                onChange={(value) => handleDraftFilterChange('risks', value)}
                            />
                        </FilterField>

                        <FilterField label='部门'>
                            <MultiSelectDropdown
                                placeholder='请选择部门'
                                options={DEPARTMENT_OPTIONS}
                                values={filterDraft.departments}
                                onChange={(value) => handleDraftFilterChange('departments', value)}
                            />
                        </FilterField>

                        <FilterField label='责任人'>
                            <MultiSelectDropdown
                                placeholder='请选择责任人'
                                options={OWNER_OPTIONS}
                                values={filterDraft.owners}
                                onChange={(value) => handleDraftFilterChange('owners', value)}
                            />
                        </FilterField>

                        <FilterField label='来源'>
                            <MultiSelectDropdown
                                placeholder='请选择来源'
                                options={SOURCE_OPTIONS}
                                values={filterDraft.sources}
                                onChange={(value) => handleDraftFilterChange('sources', value)}
                            />
                        </FilterField>
                    </div>

                    <div className='TasksPage__filterActions'>
                        <Button
                            emphasis='primary'
                            size='sm'
                            className='TasksPage__actionButton TasksPage__actionButton--primary'
                            onClick={handleQuery}
                        >
                            {'查询'}
                        </Button>
                        <Button
                            emphasis='tertiary'
                            size='sm'
                            className='TasksPage__actionButton'
                            onClick={handleReset}
                        >
                            {'重置'}
                        </Button>
                        <Button
                            emphasis='tertiary'
                            size='sm'
                            className='TasksPage__actionButton TasksPage__actionButton--ghost'
                            onClick={handleExport}
                        >
                            {'导出'}
                        </Button>
                    </div>
                </div>

                <div className='TasksPage__tableCard'>
                    <div className='TasksPage__tableWrap'>
                        <table className='TasksPage__table'>
                            <thead>
                                <tr>
                                    <th className='TasksPage__checkboxCell'>
                                        <input
                                            ref={selectAllRef}
                                            type='checkbox'
                                            checked={pagedTasks.length > 0 && pagedTasks.every((task) => selectedIds.includes(task.id))}
                                            onChange={handleToggleSelectAll}
                                        />
                                    </th>
                                    <th>{'标题'}</th>
                                    {visibleColumns.status && <th>{'状态'}</th>}
                                    {visibleColumns.owner && <th>{'责任人'}</th>}
                                    {visibleColumns.department && <th>{'部门'}</th>}
                                    {visibleColumns.dueAt && <th>{'截止'}</th>}
                                    {visibleColumns.risk && <th>{'风险'}</th>}
                                    {visibleColumns.progress && <th>{'进度'}</th>}
                                    {visibleColumns.agent && <th>{'Agent'}</th>}
                                    <th className='TasksPage__settingHeader'>
                                        <ColumnSettings
                                            visibleColumns={visibleColumns}
                                            onChange={setVisibleColumns}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedTasks.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={headerColSpan}
                                            className='TasksPage__emptyCell'
                                        >
                                            {'暂无匹配的事项数据'}
                                        </td>
                                    </tr>
                                )}
                                {pagedTasks.map((task) => (
                                    <tr key={task.id}>
                                        <td className='TasksPage__checkboxCell'>
                                            <input
                                                type='checkbox'
                                                checked={selectedIds.includes(task.id)}
                                                onChange={() => handleToggleRow(task.id)}
                                            />
                                        </td>
                                        <td className='TasksPage__titleCell'>
                                            <button
                                                type='button'
                                                className='TasksPage__titleLink'
                                            >
                                                {task.title}
                                            </button>
                                        </td>
                                        {visibleColumns.status && (
                                            <td>
                                                <div className='TasksPage__statusValue'>
                                                    <span
                                                        className='TasksPage__statusDot'
                                                        style={{backgroundColor: STATUS_META[task.status].dotColor}}
                                                    />
                                                    <span>{STATUS_META[task.status].label}</span>
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.owner && <td>{task.owner}</td>}
                                        {visibleColumns.department && <td>{task.department}</td>}
                                        {visibleColumns.dueAt && <td>{task.dueAt}</td>}
                                        {visibleColumns.risk && (
                                            <td>
                                                <span
                                                    className='TasksPage__riskTag'
                                                    style={{
                                                        color: RISK_META[task.risk].textColor,
                                                        backgroundColor: RISK_META[task.risk].backgroundColor,
                                                        borderColor: RISK_META[task.risk].borderColor,
                                                    }}
                                                >
                                                    {RISK_META[task.risk].label}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.progress && (
                                            <td>
                                                <div className='TasksPage__progressTrack'>
                                                    <div
                                                        className='TasksPage__progressBar'
                                                        style={{
                                                            width: `${task.progress}%`,
                                                            backgroundColor: task.progressColor,
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        )}
                                        {visibleColumns.agent && (
                                            <td>
                                                <span className='TasksPage__agentTag'>{task.agentLabel || '智办'}</span>
                                            </td>
                                        )}
                                        <td className='TasksPage__settingsSpacer'/>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='TasksPage__pagination'>
                        <div className='TasksPage__paginationInfo'>
                            {`共 ${filteredTasks.length} 条`}
                        </div>

                        <div className='TasksPage__paginationControls'>
                            <div className='TasksPage__pageSize'>
                                <span>{'每页'}</span>
                                <select
                                    value={pageSize}
                                    onChange={(event) => {
                                        setPageSize(Number(event.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    {[5, 10, 20].map((size) => (
                                        <option
                                            key={size}
                                            value={size}
                                        >
                                            {`${size} 条`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='TasksPage__pageNav'>
                                <button
                                    type='button'
                                    className='TasksPage__pageArrow'
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                >
                                    <ChevronLeftIcon size={16}/>
                                </button>

                                {pageNumbers.map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        type='button'
                                        className={`TasksPage__pageNumber${pageNumber === currentPage ? ' TasksPage__pageNumber--active' : ''}`}
                                        onClick={() => setCurrentPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                <button
                                    type='button'
                                    className='TasksPage__pageArrow'
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                >
                                    <ChevronRightIcon size={16}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(TasksPage);
