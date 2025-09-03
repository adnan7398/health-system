import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FaHeartbeat, FaShieldAlt, FaQrcode, FaUser, FaPhone, FaMapMarkerAlt, FaTint, FaDownload, FaShare } from "react-icons/fa";

const ArogyamCard = () => {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`https://arogyam-15io.onrender.com/register/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        console.error("Error fetching user:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const downloadCard = () => {
    // Implementation for downloading the health card
    console.log("Downloading health card...");
  };

  const shareCard = () => {
    // Implementation for sharing the health card
    console.log("Sharing health card...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Arogyam Health Card Benefits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the advantages of carrying your digital health identity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Medical Storage</h3>
              <p className="text-gray-600 text-sm">Save vital health information with military-grade encryption</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaQrcode className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Access</h3>
              <p className="text-gray-600 text-sm">Instant verification with a simple scan</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaHeartbeat className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Support</h3>
              <p className="text-gray-600 text-sm">Quick retrieval for urgent care situations</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Convenience</h3>
              <p className="text-gray-600 text-sm">Access records anytime, paper-free</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600 text-sm">Your data stays safe and confidential</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaQrcode className="text-3xl text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Identity</h3>
              <p className="text-gray-600 text-sm">Modern healthcare meets digital convenience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Card Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Digital Health Card</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Secure, accessible, and always with you
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Card Display */}
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white p-8 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHeartbeat className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Arogyam Health Card</h3>
                  <p className="text-teal-100">Digital Health Identity</p>
                </div>

                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-teal-200" />
                      <span><strong>Name:</strong> {user.firstName} {user.lastName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaTint className="text-teal-200" />
                      <span><strong>Blood Group:</strong> {user.bloodGroup || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaUser className="text-teal-200" />
                      <span><strong>Age:</strong> {user.age || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-teal-200" />
                      <span><strong>Phone:</strong> {user.phoneNumber || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-teal-200" />
                      <span><strong>Address:</strong> {user.address || "N/A"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading user information...</p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-teal-500 text-center">
                  <p className="text-teal-100 text-sm">Stay safe with Arogyam Health Card! 🌿💙</p>
                </div>
              </div>
            </div>

            {/* QR Code and Actions */}
            <div className="order-1 lg:order-2">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Scan to Verify</h3>
                
                {userId ? (
                  <div className="mb-6">
                    <QRCodeCanvas 
                      value={userId} 
                      size={200}
                      className="mx-auto border-4 border-teal-200 rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
                    <p className="text-gray-500">QR Code Loading...</p>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={downloadCard}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    Download Card
                  </button>
                  
                  <button
                    onClick={shareCard}
                    className="w-full border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaShare />
                    Share Card
                  </button>
                </div>

                <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p className="text-sm text-teal-800">
                    <strong>Tip:</strong> Keep this QR code handy for quick access to your health information during medical visits or emergencies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of users who trust Arogyam for their digital health needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/userdashboard" className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg">
              Back to Dashboard
            </a>
            <a href="/scanner" className="border-2 border-white text-white hover:bg-white hover:text-teal-700 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300">
              Scan QR Code
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArogyamCard;
