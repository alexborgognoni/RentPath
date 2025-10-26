# CodeStar Connection for GitHub integration
resource "aws_codestarconnections_connection" "github" {
  name          = "${var.project_name}-${var.environment}-github"
  provider_type = "GitHub"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-github-connection"
  })
}

# CodePipeline
resource "aws_codepipeline" "main" {
  name          = "${var.project_name}-${var.environment}"
  role_arn      = aws_iam_role.codepipeline_role.arn
  pipeline_type = "V1"

  artifact_store {
    location = "elasticbeanstalk-${var.aws_region}-${data.aws_caller_identity.current.account_id}"
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["SourceArtifact"]

      configuration = {
        ConnectionArn        = aws_codestarconnections_connection.github.arn
        FullRepositoryId     = var.github_repo
        BranchName           = var.github_branch
        OutputArtifactFormat = "CODE_ZIP"
        DetectChanges        = "true"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["SourceArtifact"]
      output_artifacts = ["BuildArtifact"]
      version          = "1"

      configuration = {
        ProjectName = aws_codebuild_project.build.name
      }
    }
  }


  stage {
    name = "Deploy"

    action {
      name            = "Deploy"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "ElasticBeanstalk"
      input_artifacts = ["BuildArtifact"]
      version         = "1"

      configuration = {
        ApplicationName = aws_elastic_beanstalk_application.main.name
        EnvironmentName = aws_elastic_beanstalk_environment.main.name
      }
    }
  }

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-pipeline"
  })
}

