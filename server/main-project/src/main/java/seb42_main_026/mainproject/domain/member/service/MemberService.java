package seb42_main_026.mainproject.domain.member.service;


import io.jsonwebtoken.io.Decoders;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import seb42_main_026.mainproject.domain.member.entity.Member;
import seb42_main_026.mainproject.domain.member.entity.Score;
import seb42_main_026.mainproject.domain.member.repository.MemberRepository;
import seb42_main_026.mainproject.domain.member.repository.ScoreRepository;
import seb42_main_026.mainproject.exception.CustomException;
import seb42_main_026.mainproject.exception.ExceptionCode;
import seb42_main_026.mainproject.security.utils.CustomAuthorityUtils;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomAuthorityUtils authorityUtils;

    private final ScoreRepository scoreRepository;


    public Member createMember(Member member){
        verifyExistsEmail(member.getEmail());
        verifyExistsNickName(member.getNickname());

        String encryptedPassword = passwordEncoder.encode(member.getPassword()); // Password 암호화

        member.setPassword(encryptedPassword);

        List<String> roles = authorityUtils.createRoles(member.getEmail()); // DB에 User Role 저장

        member.setRoles(roles);

        Member savedMember = memberRepository.save(member);

        setScore(member.getMemberId());






        return savedMember;
    }

    public List<Score> getRank(){

        List<Score> scores = scoreRepository.findTop10ByOrderByScoreDescModifiedAtAscCreatedAtAsc();


        return scores;
    }
    @Transactional(readOnly = true)
    public Member getMember(Long memberId){
        Member member = findVerifiedMember(memberId);

        return member;
    }

    public Member updateMember(Member member){

        // 로그인 멤버 권한 검사
        verifyLoginMember(member.getMemberId());

        // 멤버 확인
        Member verifiedMember = findVerifiedMember(member.getMemberId());

        // 바꾸려는 닉네임 중복 확인
        verifyExistsNickName(member.getNickname());

        // 닉네임 변경
        verifiedMember.setNickname(member.getNickname());


        return verifiedMember;

    }

    public Member changePaaswordMember(List<Member> members){
        // 로그인 멤버 권한 검사
        verifyLoginMember(members.get(0).getMemberId());

        // 기존 비밀번호 가져오기 위한 멤버 엔티티 가져오기
        Member member = findVerifiedMember(members.get(0).getMemberId());

        // 현재 패스워드 매치
        // 일치 했을떄
        if(passwordEncoder.matches(members.get(0).getPassword(),member.getPassword())){
            System.out.println(members.get(1).getPassword());
            // 새로운 비밀번호변경
            member.setPassword(members.get(1).getPassword());
            return member;
        // 불일치 했을때
        }else {
            throw new CustomException(ExceptionCode.PASSWORD_NOT_MATCH);
        }




    }

    public void deleteMember(Long memberId){
        // 로그인 멤버 권한 검사
        verifyLoginMember(memberId);

        memberRepository.deleteById(memberId);
        // 멤버 상태 변경 (원래)
        // findVerifiedMember(memberId).setMemberStatus(Member.MemberStatus.MEMBER_DELETE);


    }

    public void verifyExistsEmail(String email){
        Optional<Member> member = memberRepository.findByEmail(email);

        if (member.isPresent()){
            throw new CustomException(ExceptionCode.MEMBER_EXISTS);
        }
    }

    public void verifyExistsNickName(String nickname){
        Optional<Member> member = memberRepository.findByNickname(nickname);

        if (member.isPresent()){
            throw new CustomException(ExceptionCode.NICKNAME_EXISTS);
        }
    }

    public Member findVerifiedMember(Long memberId){
        Optional<Member> member = memberRepository.findById(memberId);
        Member verifiedMember = member.orElseThrow(() -> new CustomException(ExceptionCode.MEMBER_NOT_FOUND));

        return verifiedMember;
    }


    public void verifyLoginMember(Long memberId){
        if(! getTokenMemberId().equals(memberId)){
            throw new CustomException(ExceptionCode.UNAUTHORIZED_USER);
        }
    }

    private Long getTokenMemberId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Member member = memberRepository.findByEmail(authentication.getName()).get(); //  If a value is present, returns the value, otherwise throws NoSuchElementException.

        return member.getMemberId();
    }



    public void verifyMemberByMemberId(long questionMemberId, long updateMemberId) {
        if (questionMemberId != updateMemberId) {
            throw new CustomException(ExceptionCode.UNAUTHORIZED_USER);
        }
    }

    public void setScore(Long memberId){
        Score score = new Score();

        score.setScore(0L);
        score.setMember(getMember(memberId));
        score.setNickname(getMember(memberId).getNickname());

        scoreRepository.save(score);

    }

    public Score updateScore(Long memberId, Long score){
        Member member = findVerifiedMember(memberId);
        Score updateScore = scoreRepository.findByMember_MemberId(memberId);
        Long changedScore = updateScore.getScore() + score;

        if(changedScore>= 50 && 100 > changedScore){

            member.setHammerTier(Member.HammerTier.BRONZE_HAMMER);

        }else if(changedScore >= 100 && 150 > changedScore ){

            member.setHammerTier(Member.HammerTier.SILVER_HAMMER);

        }else if(changedScore >= 150 && 200 > changedScore){

            member.setHammerTier(Member.HammerTier.GOLD_HAMMER);

        }else if(changedScore >= 200){

            member.setHammerTier(Member.HammerTier.PPONG_HAMMER);

        }

        updateScore.setScore(updateScore.getScore() + score);


        return updateScore;

    }


}
