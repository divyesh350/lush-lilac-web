import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiDeleteBinLine , RiSendPlaneLine } from "react-icons/ri";
import useNewsletterStore from "../../store/newsletterStore";
import BaseTable from "../../components/tables/BaseTable";
import TablePagination from "../../components/tables/TablePagination";
import TableToolbar from "../../components/tables/TableToolbar";

const Newsletter = () => {
  const {
    subscribers,
    loading,
    fetchSubscribers,
    sendNewsletter,
    deleteSubscriber,
  } = useNewsletterStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSendForm, setShowSendForm] = useState(false);
  const [newsletterData, setNewsletterData] = useState({
    subject: "",
    content: "",
  });

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const columns = [
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "subscribedAt",
      label: "Subscribed On",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={() => handleDelete(row.email)}
          className="p-1 text-gray-600 hover:text-red-500"
          title="Remove Subscriber"
        >
          <RiDeleteBinLine />
        </button>
      ),
    },
  ];

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (email) => {
    if (window.confirm("Are you sure you want to remove this subscriber?")) {
      await deleteSubscriber(email);
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    try {
      await sendNewsletter(newsletterData.subject, newsletterData.content);
      setShowSendForm(false);
      setNewsletterData({ subject: "", content: "" });
    } catch (error) {
      console.error("Failed to send newsletter:", error);
    }
  };

  const toolbarActions = [
    {
      label: "Send Newsletter",
      icon: <RiSendPlaneLine />,
      onClick: () => setShowSendForm(true),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Newsletter Management
        </h1>
      </div>

      <TableToolbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        actions={toolbarActions}
      />

      <BaseTable
        columns={columns}
        data={paginatedSubscribers}
        loading={loading}
      />

      <div className="mt-4">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showSendForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
          >
            <h2 className="text-xl font-semibold mb-4">Send Newsletter</h2>
            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newsletterData.subject}
                  onChange={(e) =>
                    setNewsletterData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newsletterData.content}
                  onChange={(e) =>
                    setNewsletterData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary h-48"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSendForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Newsletter"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
