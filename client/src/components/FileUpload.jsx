import PropTypes from "prop-types";
import { useState, useMemo } from "react";
import { Table, Input, Button } from "antd";

const FileUpload = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersSearchTerm, setFollowersSearchTerm] = useState("");
  const [followingSearchTerm, setFollowingSearchTerm] = useState("");
  const [showNotFollowingBack, setShowNotFollowingBack] = useState(false);

  const handleFileChange = (event, setData, isFollowing) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (isFollowing) {
            setData(json.relationships_following || []);
          } else {
            setData(json || []);
          }
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleShowNotFollowingBack = () => {
    setShowNotFollowingBack(!showNotFollowingBack);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full md:w-1/2 bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload Followers.json</h2>
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleFileChange(e, setFollowers, false)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
            />
          </div>
          <div className="w-full md:w-1/2 bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload Following.json</h2>
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleFileChange(e, setFollowing, true)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <div className="w-full md:w-1/2 bg-gray-800 p-4 rounded-lg shadow-md">
          {followers.length > 0 && (
            <FollowersTable
              data={followers}
              searchTerm={followersSearchTerm}
              setSearchTerm={setFollowersSearchTerm}
            />
          )}
        </div>
        <div className="w-full md:w-1/2 bg-gray-800 p-4 rounded-lg shadow-md">
          {following.length > 0 && (
            <FollowingTable
              data={following}
              searchTerm={followingSearchTerm}
              setSearchTerm={setFollowingSearchTerm}
            />
          )}
        </div>
      </div>
      {followers.length > 0 && following.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <Button
            type="primary"
            onClick={toggleShowNotFollowingBack}
            className="mb-4 bg-blue-600 hover:bg-blue-700 border-blue-700"
          >
            {showNotFollowingBack ? "Hide" : "Show"} Not Following Back
          </Button>
          {showNotFollowingBack && (
            <ComparisonTable followers={followers} following={following} />
          )}
        </div>
      )}
    </div>
  );
};

const FollowersTable = ({ data, searchTerm, setSearchTerm }) => {
  const filteredData = useMemo(() => {
    return (data || [])
      .flatMap((item) => item.string_list_data || [])
      .filter((entry) =>
        entry.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [data, searchTerm]);

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Profile",
      dataIndex: "value",
      key: "value",
      render: (text, record) => (
        <a
          href={record.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {text}
        </a>
      ),
      sorter: (a, b) => a.value.localeCompare(b.value),
    },
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => new Date(timestamp * 1000).toLocaleString(),
      sorter: (a, b) => a.timestamp - b.timestamp,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <h3 className="text-xl font-bold mb-4">Followers</h3>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 bg-gray-700 border border-gray-600 text-white"
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="value"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        className="bg-gray-800"
      />
    </div>
  );
};

FollowersTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      string_list_data: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          timestamp: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

const FollowingTable = ({ data, searchTerm, setSearchTerm }) => {
  const filteredData = useMemo(() => {
    return (data || [])
      .flatMap((item) => item.string_list_data || [])
      .filter((entry) =>
        entry.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [data, searchTerm]);

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Profile",
      dataIndex: "value",
      key: "value",
      render: (text, record) => (
        <a
          href={record.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {text}
        </a>
      ),
      sorter: (a, b) => a.value.localeCompare(b.value),
    },
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => new Date(timestamp * 1000).toLocaleString(),
      sorter: (a, b) => a.timestamp - b.timestamp,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <h3 className="text-xl font-bold mb-4">Following</h3>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 bg-gray-700 border border-gray-600 text-white"
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="value"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
        className="bg-gray-800"
      />
    </div>
  );
};

FollowingTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      string_list_data: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          timestamp: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

const ComparisonTable = ({ followers, following }) => {
  const followersUsernames = (followers || [])
    .flatMap((item) => item.string_list_data || [])
    .map((entry) => entry.value.toLowerCase());

  const followingUsernames = (following || [])
    .flatMap((item) => item.string_list_data || [])
    .map((entry) => entry.value.toLowerCase());

  const notFollowingBack = followingUsernames.filter(
    (username) => !followersUsernames.includes(username)
  );

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Profile",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <a
          href={`https://www.instagram.com/${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {text}
        </a>
      ),
    },
  ];

  const data = notFollowingBack.map((username, index) => ({
    key: index,
    username,
  }));

  return (
    <div className="mt-4 overflow-x-auto">
      <h3 className="text-xl font-bold mb-4">Not Following Back</h3>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        rowKey="username"
        className="bg-gray-800"
      />
    </div>
  );
};

ComparisonTable.propTypes = {
  followers: PropTypes.arrayOf(
    PropTypes.shape({
      string_list_data: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          timestamp: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  following: PropTypes.arrayOf(
    PropTypes.shape({
      string_list_data: PropTypes.arrayOf(
        PropTypes.shape({
          href: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          timestamp: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default FileUpload;
