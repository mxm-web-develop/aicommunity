"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";

interface Contact {
  _id: string;
  name: string;
  // 其他联系人字段...
}

interface Organization {
  id: string;
  name: string;
  // 其他组织字段...
}

interface ContactOption {
  value: string;
  label: string;
}

export default function ApplicationForm() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormData = {
    name: "",
    shortIntro: "",
    status: 1,
    organizationId: "",
    network: "gientech",
    gientechType: "",
    keywords: [] as string[],
    links: {
      website: "",
      github: "",
      demo: ""
    },
    tags: [] as string[],
    contact: [] as string[],
    awards: [] as string[]
  };

  const [formData, setFormData] = useState(initialFormData);

  // 获取联系人列表
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contacts");
        const result = await response.json();
        // 转换数据格式以适配 react-select
        const options = result.data.map((contact: any) => ({
          value: contact.id,
          label: contact.name
        }));
        setContacts(options);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  // 获取组织列表
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organization");
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        console.error("获取组织列表失败:", error);
      }
    };
    fetchOrganizations();
  }, []);

  // 获取当前选中的联系人选项
  const selectedContacts = contacts.filter((option: any) =>
    formData.contact.includes(option.value)
  );

  // 处理标签类输入（keywords 和 awards）
  const handleArrayInput = (field: "keywords" | "awards", value: string) => {
    if (value.trim()) {
      // 按"、"分割输入的文本
      const newItems = value
        .split("、")
        .map((item) => item.trim())
        .filter((item) => item);
      // 过滤掉已存在的项
      const uniqueItems = newItems.filter(
        (item) => !formData[field].includes(item)
      );

      if (uniqueItems.length > 0) {
        setFormData({
          ...formData,
          [field]: [...formData[field], ...uniqueItems]
        });
      }
    }
  };

  // 删除标签
  const handleRemoveTag = (field: "keywords" | "awards", index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("提交失败");
      }

      const data = await response.json();

      // 重置表单
      setFormData(initialFormData);

      // 提示成功
      alert("应用创建成功！");

      // 刷新整个页面的服务端组件
      router.refresh();
    } catch (error) {
      console.error("提交错误:", error);
      alert("提交失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          应用名称 *
        </label>
        <input
          type="text"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          简介
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3"
          value={formData.shortIntro}
          maxLength={1000}
          onChange={(e) =>
            setFormData({ ...formData, shortIntro: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          组织 *
        </label>
        <select
          required
          className="shadow border rounded w-full py-2 px-3"
          value={formData.organizationId}
          onChange={(e) =>
            setFormData({ ...formData, organizationId: e.target.value })
          }
        >
          <option value="">请选择组织</option>
          {organizations.map((org) => (
            <option key={org._id} value={org._id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          应用类型
        </label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3"
          value={formData.gientechType}
          onChange={(e) =>
            setFormData({ ...formData, gientechType: e.target.value })
          }
          placeholder="请输入应用类型"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          链接
        </label>
        <input
          type="url"
          placeholder="网站链接"
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-2"
          value={formData.links.website}
          onChange={(e) =>
            setFormData({
              ...formData,
              links: { ...formData.links, website: e.target.value }
            })
          }
        />
        <input
          type="url"
          placeholder="GitHub链接"
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-2"
          value={formData.links.github}
          onChange={(e) =>
            setFormData({
              ...formData,
              links: { ...formData.links, github: e.target.value }
            })
          }
        />
        <input
          type="url"
          placeholder="演示链接"
          className="shadow appearance-none border rounded w-full py-2 px-3"
          value={formData.links.demo}
          onChange={(e) =>
            setFormData({
              ...formData,
              links: { ...formData.links, demo: e.target.value }
            })
          }
        />
      </div>

      {/* 联系人选择器 */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          联系人
        </label>
        <Select
          isMulti
          options={contacts || []}
          value={selectedContacts}
          onChange={(selected) => {
            const selectedValues = (selected as any[]).map(
              (option) => option.value
            );
            setFormData({
              ...formData,
              contact: selectedValues
            });
          }}
          placeholder="选择联系人..."
          noOptionsMessage={() => "没有找到匹配的联系人"}
          classNames={{
            control: (state) =>
              "shadow border rounded py-1 px-2" +
              (state.isFocused ? " border-blue-500" : "")
          }}
        />
      </div>

      {/* 关键词输入 */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          关键词
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.keywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-blue-100 px-2 py-1 rounded-full text-sm flex items-center"
            >
              {keyword}
              <button
                type="button"
                className="ml-1 text-red-500"
                onClick={() => handleRemoveTag("keywords", index)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3"
          placeholder="输入关键词后按回车添加（支持复制多个关键词，用、分隔）"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleArrayInput("keywords", e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pastedText = e.clipboardData.getData("text");
            handleArrayInput("keywords", pastedText);
            e.currentTarget.value = "";
          }}
        />
      </div>

      {/* 奖项输入 */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          获奖情况
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.awards.map((award, index) => (
            <span
              key={index}
              className="bg-green-100 px-2 py-1 rounded-full text-sm flex items-center"
            >
              {award}
              <button
                type="button"
                className="ml-1 text-red-500"
                onClick={() => handleRemoveTag("awards", index)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3"
          placeholder="输入奖项后按回车添加"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleArrayInput("awards", e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          bg-blue-500 text-white font-bold py-2 px-4 rounded
          ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }
        `}
      >
        {isSubmitting ? "提交中..." : "提交"}
      </button>
    </form>
  );
}
