// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import type {ChangeEvent} from 'react';
import {useDispatch} from 'react-redux';

import {Button} from '@mattermost/shared/components/button';
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ContentCopyIcon,
    EyeOutlineIcon,
    MagnifyIcon,
} from '@mattermost/compass-icons/components';

import {selectLhsItem} from 'actions/views/lhs';
import {suppressRHS, unsuppressRHS} from 'actions/views/rhs';

import {LhsItemType, LhsPage} from 'types/store/lhs';

import './contacts_page.scss';

type MemberFilter = 'all' | 'member' | 'digital_employee';
type MemberType = 'member' | 'digital_employee';
type Gender = '男' | '女';

type OrgNode = {
    id: string;
    name: string;
    count: number;
    children?: OrgNode[];
};

type MemberRecord = {
    id: string;
    orgNodeId: string;
    type: MemberType;
    name: string;
    department: string;
    departmentPath: string;
    company: string;
    online: boolean;
    gender?: Gender;
    position?: string;
    phone?: string;
    email?: string;
    corporateEmail?: string;
    aiDescription?: string;
    remark?: string;
};

const MOCK_ORG_TREE: OrgNode[] = [
    {
        id: 'root',
        name: '龙智集团',
        count: 368,
        children: [
            {id: 'leadership', name: '公司领导层', count: 12},
            {id: 'general', name: '综合部', count: 18},
            {id: 'strategy', name: '战略投资部', count: 15},
            {id: 'audit', name: '经营与财务审计部', count: 9},
            {id: 'compliance', name: '合规部', count: 11},
            {id: 'delivery', name: '集成交付中心算力运营项目', count: 24},
            {id: 'quality', name: '质量运营中心', count: 16},
            {id: 'data-asset', name: '数据资产管理中心', count: 21},
            {id: 'demo', name: '示范事业部', count: 84},
            {id: 'tech', name: '技术部门', count: 32},
            {
                id: 'city-ops',
                name: '城运事业部',
                count: 126,
                children: [
                    {id: 'city-center', name: '城运中心', count: 68},
                    {id: 'city-product', name: '产品组', count: 22},
                    {id: 'city-delivery', name: '交付组', count: 36},
                ],
            },
            {
                id: 'subsidiaries',
                name: '子公司',
                count: 98,
                children: [
                    {id: 'sub-lg-pipe', name: '龙岗区信息管道有限公司', count: 18},
                    {id: 'sub-qichuang', name: '启创数智科技有限公司', count: 14},
                    {id: 'sub-yuansheng', name: '深圳市元生基石人工智能有限公司', count: 12},
                    {id: 'sub-longyi', name: '深圳市龙医智慧健康科技有限公司', count: 16},
                    {id: 'sub-yuanjun', name: '深圳市元均科技有限公司', count: 20},
                    {id: 'sub-association', name: '深圳市龙岗区数据产业协会', count: 18},
                ],
            },
        ],
    },
];

const MOCK_MEMBERS: MemberRecord[] = [
    {
        id: 'member-001',
        orgNodeId: 'demo',
        type: 'member',
        name: '张建国',
        department: '示范事业部',
        departmentPath: '示范事业部/示范中心/项目经理',
        company: '龙岗数据公司',
        online: true,
        gender: '男',
        position: '项目经理',
        phone: '13912345678',
        email: 'zhangjianguo@example.com',
        corporateEmail: 'zhangjianguo@lgdg.cc',
        remark: '',
    },
    {
        id: 'member-002',
        orgNodeId: 'demo',
        type: 'digital_employee',
        name: '协作助手-AI',
        department: '数字员工',
        departmentPath: '示范事业部/数字员工',
        company: '龙岗数据公司',
        online: true,
        aiDescription: '事项汇总 / 进展提醒',
    },
    {
        id: 'member-003',
        orgNodeId: 'demo',
        type: 'member',
        name: '王敏',
        department: '示范事业部',
        departmentPath: '城运事业部/城运中心/产品经理',
        company: '龙岗数据公司',
        online: true,
        gender: '男',
        position: '产品经理',
        phone: '13888888888',
        email: 'wangmin@example.com',
        corporateEmail: 'wangmin@lgdg.cc',
        remark: '',
    },
    {
        id: 'member-004',
        orgNodeId: 'demo',
        type: 'member',
        name: '李娜',
        department: '示范事业部',
        departmentPath: '示范事业部/示范中心/运营专员',
        company: '龙岗数据公司',
        online: false,
        gender: '女',
        position: '运营专员',
        phone: '13666668888',
        email: 'lina@example.com',
        corporateEmail: 'lina@lgdg.cc',
    },
    {
        id: 'member-005',
        orgNodeId: 'city-center',
        type: 'member',
        name: '陈晨',
        department: '城运中心',
        departmentPath: '城运事业部/城运中心/技术负责人',
        company: '龙岗数据公司',
        online: true,
        gender: '女',
        position: '技术负责人',
        phone: '13700001111',
        email: 'chenchen@example.com',
        corporateEmail: 'chenchen@lgdg.cc',
    },
    {
        id: 'member-006',
        orgNodeId: 'city-center',
        type: 'digital_employee',
        name: '数据分析-AI',
        department: '数字员工',
        departmentPath: '城运事业部/数字员工',
        company: '龙岗数据公司',
        online: true,
        aiDescription: '报表生成 / 数据洞察',
    },
];

const MEMBER_FILTER_TABS: Array<{key: MemberFilter; label: string}> = [
    {key: 'all', label: '全部'},
    {key: 'member', label: '成员'},
    {key: 'digital_employee', label: '数字员工'},
];

function includesIgnoreCase(target: string, keyword: string) {
    return target.toLowerCase().includes(keyword.trim().toLowerCase());
}

function maskPhone(phone: string) {
    if (phone.length < 7) {
        return phone;
    }
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

function getInitial(name: string) {
    return name.charAt(0);
}

function collectExpandableNodeIds(nodes: OrgNode[]): Set<string> {
    const ids = new Set<string>();

    const walk = (nodeList: OrgNode[]) => {
        nodeList.forEach((node) => {
            if (node.children?.length) {
                ids.add(node.id);
                walk(node.children);
            }
        });
    };

    walk(nodes);
    return ids;
}

function filterOrgTree(nodes: OrgNode[], keyword: string): OrgNode[] {
    if (!keyword.trim()) {
        return nodes;
    }

    const walk = (nodeList: OrgNode[]): OrgNode[] => {
        return nodeList.reduce<OrgNode[]>((acc, node) => {
            const filteredChildren = node.children ? walk(node.children) : [];
            const matchesSelf = includesIgnoreCase(node.name, keyword);

            if (matchesSelf || filteredChildren.length > 0) {
                acc.push({
                    ...node,
                    children: filteredChildren.length > 0 ? filteredChildren : node.children,
                });
            }

            return acc;
        }, []);
    };

    return walk(nodes);
}

function collectVisibleNodeIds(nodes: OrgNode[]): Set<string> {
    const ids = new Set<string>();

    const walk = (nodeList: OrgNode[]) => {
        nodeList.forEach((node) => {
            ids.add(node.id);
            if (node.children?.length) {
                walk(node.children);
            }
        });
    };

    walk(nodes);
    return ids;
}

type OrgTreeNodeProps = {
    node: OrgNode;
    depth: number;
    selectedNodeId: string;
    expandedNodeIds: Set<string>;
    visibleNodeIds: Set<string>;
    onSelect: (nodeId: string) => void;
    onToggle: (nodeId: string) => void;
};

function OrgTreeNode({
    node,
    depth,
    selectedNodeId,
    expandedNodeIds,
    visibleNodeIds,
    onSelect,
    onToggle,
}: OrgTreeNodeProps) {
    if (!visibleNodeIds.has(node.id)) {
        return null;
    }

    const hasChildren = Boolean(node.children?.length);
    const isExpanded = expandedNodeIds.has(node.id);
    const isSelected = selectedNodeId === node.id;

    return (
        <>
            <div
                className={`ContactsPage__treeNode${isSelected ? ' ContactsPage__treeNode--selected' : ''}`}
                style={{paddingLeft: `${12 + depth * 16}px`}}
                role='treeitem'
                aria-selected={isSelected}
            >
                {hasChildren ? (
                    <button
                        type='button'
                        className='ContactsPage__treeToggle'
                        aria-label={isExpanded ? '折叠' : '展开'}
                        onClick={() => onToggle(node.id)}
                    >
                        {isExpanded ? <ChevronDownIcon size={14}/> : <ChevronRightIcon size={14}/>}
                    </button>
                ) : (
                    <span className='ContactsPage__treeToggle ContactsPage__treeToggle--placeholder'/>
                )}
                <button
                    type='button'
                    className='ContactsPage__treeSelect'
                    onClick={() => onSelect(node.id)}
                >
                    {`${node.name} (${node.count})`}
                </button>
            </div>
            {hasChildren && isExpanded && node.children?.map((child) => (
                <OrgTreeNode
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                    selectedNodeId={selectedNodeId}
                    expandedNodeIds={expandedNodeIds}
                    visibleNodeIds={visibleNodeIds}
                    onSelect={onSelect}
                    onToggle={onToggle}
                />
            ))}
        </>
    );
}

function ContactsPage() {
    const dispatch = useDispatch();

    const [orgSearchDraft, setOrgSearchDraft] = useState('');
    const [orgSearch, setOrgSearch] = useState('');
    const [selectedOrgNodeId, setSelectedOrgNodeId] = useState('demo');
    const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(() => collectExpandableNodeIds(MOCK_ORG_TREE));
    const [memberFilter, setMemberFilter] = useState<MemberFilter>('all');
    const [selectedMemberId, setSelectedMemberId] = useState('member-001');
    const [phoneVisible, setPhoneVisible] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [remarks, setRemarks] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(selectLhsItem(LhsItemType.Page, LhsPage.Contacts));
        dispatch(suppressRHS);

        return () => {
            dispatch(unsuppressRHS);
        };
    }, [dispatch]);

    useEffect(() => {
        const timer = window.setTimeout(() => setOrgSearch(orgSearchDraft), 200);
        return () => window.clearTimeout(timer);
    }, [orgSearchDraft]);

    const filteredOrgTree = useMemo(() => filterOrgTree(MOCK_ORG_TREE, orgSearch), [orgSearch]);
    const visibleNodeIds = useMemo(() => collectVisibleNodeIds(filteredOrgTree), [filteredOrgTree]);

    useEffect(() => {
        if (!orgSearch.trim()) {
            return;
        }

        setExpandedNodeIds((prev) => {
            const next = new Set(prev);
            visibleNodeIds.forEach((nodeId) => next.add(nodeId));
            return next;
        });
    }, [orgSearch, visibleNodeIds]);

    const filteredMembers = useMemo(() => {
        return MOCK_MEMBERS.filter((member) => {
            if (member.orgNodeId !== selectedOrgNodeId) {
                return false;
            }

            if (memberFilter === 'member') {
                return member.type === 'member';
            }

            if (memberFilter === 'digital_employee') {
                return member.type === 'digital_employee';
            }

            return true;
        });
    }, [memberFilter, selectedOrgNodeId]);

    const selectedMember = useMemo(() => {
        return MOCK_MEMBERS.find((member) => member.id === selectedMemberId) || filteredMembers[0];
    }, [filteredMembers, selectedMemberId]);

    useEffect(() => {
        if (filteredMembers.length === 0) {
            return;
        }

        if (!filteredMembers.some((member) => member.id === selectedMemberId)) {
            setSelectedMemberId(filteredMembers[0].id);
        }
    }, [filteredMembers, selectedMemberId]);

    useEffect(() => {
        setPhoneVisible(false);
    }, [selectedMember?.id]);

    const handleToggleNode = useCallback((nodeId: string) => {
        setExpandedNodeIds((prev) => {
            const next = new Set(prev);
            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }
            return next;
        });
    }, []);

    const handleCopy = useCallback(async (fieldKey: string, value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(fieldKey);
            window.setTimeout(() => setCopiedField(null), 1500);
        } catch {
            // Ignore clipboard errors in unsupported environments.
        }
    }, []);

    const handleRemarkChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        if (!selectedMember) {
            return;
        }

        setRemarks((prev) => ({
            ...prev,
            [selectedMember.id]: event.target.value,
        }));
    }, [selectedMember]);

    const currentRemark = selectedMember ? (remarks[selectedMember.id] ?? selectedMember.remark ?? '') : '';

    return (
        <div className='ContactsPage app__content'>
            <div className='ContactsPage__layout'>
                <aside className='ContactsPage__orgPanel a11y__region'>
                    <div className='ContactsPage__orgSearch'>
                        <MagnifyIcon size={16}/>
                        <input
                            value={orgSearchDraft}
                            onChange={(event) => setOrgSearchDraft(event.target.value)}
                            placeholder='搜索公司、部门'
                            aria-label='搜索公司、部门'
                        />
                    </div>

                    <div
                        className='ContactsPage__orgTree'
                        role='tree'
                        aria-label='组织架构'
                    >
                        {filteredOrgTree.map((node) => (
                            <OrgTreeNode
                                key={node.id}
                                node={node}
                                depth={0}
                                selectedNodeId={selectedOrgNodeId}
                                expandedNodeIds={expandedNodeIds}
                                visibleNodeIds={visibleNodeIds}
                                onSelect={setSelectedOrgNodeId}
                                onToggle={handleToggleNode}
                            />
                        ))}
                    </div>
                </aside>

                <section className='ContactsPage__memberPanel a11y__region'>
                    <div
                        className='ContactsPage__memberTabs'
                        role='tablist'
                        aria-label='人员筛选'
                    >
                        {MEMBER_FILTER_TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type='button'
                                role='tab'
                                aria-selected={memberFilter === tab.key}
                                className={`ContactsPage__memberTab${memberFilter === tab.key ? ' ContactsPage__memberTab--active' : ''}`}
                                onClick={() => setMemberFilter(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className='ContactsPage__memberList'>
                        {filteredMembers.length === 0 ? (
                            <div className='ContactsPage__emptyState'>{'暂无人员'}</div>
                        ) : filteredMembers.map((member) => {
                            const isSelected = selectedMember?.id === member.id;
                            const isDigital = member.type === 'digital_employee';

                            return (
                                <button
                                    key={member.id}
                                    type='button'
                                    className={`ContactsPage__memberItem${isSelected ? ' ContactsPage__memberItem--selected' : ''}`}
                                    onClick={() => setSelectedMemberId(member.id)}
                                >
                                    {isDigital ? (
                                        <span className='ContactsPage__memberAvatar ContactsPage__memberAvatar--ai'>
                                            <span className='ContactsPage__aiFace'>{'AI'}</span>
                                        </span>
                                    ) : (
                                        <span className='ContactsPage__memberAvatar'>
                                            {getInitial(member.name)}
                                        </span>
                                    )}

                                    <span className='ContactsPage__memberContent'>
                                        <span className='ContactsPage__memberTitleRow'>
                                            <span className='ContactsPage__memberName'>{member.name}</span>
                                            {isDigital && (
                                                <span className='ContactsPage__aiBadge'>{'AI'}</span>
                                            )}
                                        </span>
                                        <span className='ContactsPage__memberDepartment'>{member.department}</span>
                                        {isDigital ? (
                                            <span className='ContactsPage__memberMeta'>{member.aiDescription}</span>
                                        ) : (
                                            <span className='ContactsPage__memberMeta'>
                                                {member.online && (
                                                    <span className='ContactsPage__onlineDot'/>
                                                )}
                                                <span>
                                                    {member.online ? '在线 · 可发起协作' : '离线'}
                                                </span>
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className='ContactsPage__detailPanel a11y__region'>
                    {selectedMember ? (
                        <>
                            <div className='ContactsPage__detailHeader'>
                                <h2 className='ContactsPage__detailTitle'>{'成员详情'}</h2>
                                {selectedMember.type === 'member' && (
                                    <span className={`ContactsPage__onlineTag${selectedMember.online ? ' ContactsPage__onlineTag--online' : ''}`}>
                                        {selectedMember.online ? '在线' : '离线'}
                                    </span>
                                )}
                            </div>

                            <div className='ContactsPage__profile'>
                                {selectedMember.type === 'digital_employee' ? (
                                    <span className='ContactsPage__profileAvatar ContactsPage__profileAvatar--ai'>
                                        <span className='ContactsPage__aiFace ContactsPage__aiFace--large'>{'AI'}</span>
                                    </span>
                                ) : (
                                    <span className='ContactsPage__profileAvatar'>
                                        {getInitial(selectedMember.name)}
                                        {selectedMember.online && (
                                            <span className='ContactsPage__profileStatusDot'/>
                                        )}
                                    </span>
                                )}

                                <div className='ContactsPage__profileInfo'>
                                    <div className='ContactsPage__profileNameRow'>
                                        <span className='ContactsPage__profileName'>{selectedMember.name}</span>
                                        {selectedMember.gender && (
                                            <span className='ContactsPage__genderTag'>{selectedMember.gender}</span>
                                        )}
                                        {selectedMember.type === 'digital_employee' && (
                                            <span className='ContactsPage__aiBadge ContactsPage__aiBadge--large'>{'AI'}</span>
                                        )}
                                    </div>
                                    {selectedMember.position && (
                                        <div className='ContactsPage__profilePosition'>{selectedMember.position}</div>
                                    )}
                                    {selectedMember.aiDescription && (
                                        <div className='ContactsPage__profilePosition'>{selectedMember.aiDescription}</div>
                                    )}
                                </div>
                            </div>

                            <div className='ContactsPage__infoSection'>
                                <h3 className='ContactsPage__infoTitle'>{'基本信息'}</h3>

                                {selectedMember.phone && (
                                    <div className='ContactsPage__infoRow'>
                                        <span className='ContactsPage__infoLabel'>{'手机'}</span>
                                        <span className='ContactsPage__infoValue'>
                                            {phoneVisible ? selectedMember.phone : maskPhone(selectedMember.phone)}
                                        </span>
                                        <button
                                            type='button'
                                            className='ContactsPage__infoAction'
                                            aria-label={phoneVisible ? '隐藏手机号' : '显示手机号'}
                                            onClick={() => setPhoneVisible((prev) => !prev)}
                                        >
                                            <EyeOutlineIcon size={16}/>
                                        </button>
                                    </div>
                                )}

                                {selectedMember.email && (
                                    <div className='ContactsPage__infoRow'>
                                        <span className='ContactsPage__infoLabel'>{'邮箱'}</span>
                                        <span className='ContactsPage__infoValue'>{selectedMember.email}</span>
                                        <button
                                            type='button'
                                            className='ContactsPage__infoAction'
                                            aria-label='复制邮箱'
                                            onClick={() => handleCopy('email', selectedMember.email!)}
                                        >
                                            {copiedField === 'email' ? <CheckIcon size={16}/> : <ContentCopyIcon size={16}/>}
                                        </button>
                                    </div>
                                )}

                                {selectedMember.corporateEmail && (
                                    <div className='ContactsPage__infoRow'>
                                        <span className='ContactsPage__infoLabel'>{'企业邮箱'}</span>
                                        <span className='ContactsPage__infoValue'>{selectedMember.corporateEmail}</span>
                                        <button
                                            type='button'
                                            className='ContactsPage__infoAction'
                                            aria-label='复制企业邮箱'
                                            onClick={() => handleCopy('corporateEmail', selectedMember.corporateEmail!)}
                                        >
                                            {copiedField === 'corporateEmail' ? <CheckIcon size={16}/> : <ContentCopyIcon size={16}/>}
                                        </button>
                                    </div>
                                )}

                                <div className='ContactsPage__infoRow'>
                                    <span className='ContactsPage__infoLabel'>{'部门'}</span>
                                    <span className='ContactsPage__infoValue'>{selectedMember.departmentPath}</span>
                                </div>

                                <div className='ContactsPage__infoRow'>
                                    <span className='ContactsPage__infoLabel'>{'企业'}</span>
                                    <span className='ContactsPage__infoValue'>{selectedMember.company}</span>
                                </div>
                            </div>

                            <div className='ContactsPage__remarkSection'>
                                <div className='ContactsPage__remarkHeader'>
                                    <span className='ContactsPage__infoTitle'>{'备注'}</span>
                                    <ChevronRightIcon size={16}/>
                                </div>
                                <textarea
                                    className='ContactsPage__remarkInput'
                                    value={currentRemark}
                                    onChange={handleRemarkChange}
                                    placeholder='添加备注、标签或个人说明'
                                    rows={3}
                                />
                            </div>

                            <div className='ContactsPage__detailFooter'>
                                <Button
                                    type='button'
                                    emphasis='primary'
                                    size='lg'
                                    className='ContactsPage__sendMessageBtn'
                                >
                                    {'发送消息'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className='ContactsPage__emptyState ContactsPage__emptyState--detail'>{'请选择人员查看详情'}</div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default React.memo(ContactsPage);
