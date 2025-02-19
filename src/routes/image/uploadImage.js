const express = require("express");
const auth = require("../../../middleware/auth");
const multer = require("multer");
const path = require("path");

module.exports = (db) => {
    const router = express.Router();

    // 파일 저장 설정
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/'); // 이미지를 저장할 폴더
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname)); // 파일 이름 설정
        }
    });

    const upload = multer({ storage: storage }).single('image'); // 'image'는 폼 데이터의 필드 이름

    // 이미지 업로드 라우트
    router.post("/", auth, async (req, res) => {
        try {
            upload(req, res, function (err) {
                if (err) { // 업로드 중 오류가 발생하면 처리
                    return res.status(500).json({ message: "이미지 업로드 실패", error: err.message });
                }

                // 파일이 제대로 업로드되었는지 확인
                if (!req.file) {
                    return res.status(400).json({ message: "이미지가 업로드되지 않았습니다" });
                }

                // 이미지 URL 생성
                const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

                // 응답 형식에 맞게 반환
                const response = {
                    imageUrl: imageUrl
                }

                res.status(200).json(response);
            });
        } catch (err) {
            res.status(err.status || 500).json({ message: err.message || "서버 오류가 발생했습니다" });
        }
    });

    return router;
};